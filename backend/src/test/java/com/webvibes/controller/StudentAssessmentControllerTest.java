package com.webvibes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.*;
import com.webvibes.entity.*;
import com.webvibes.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class StudentAssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private StudentAssessmentRepository studentAssessmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Student student;
    private Student studentNoPayment;

    @BeforeEach
    void setUp() {
        // Create student with FULL payment
        student = new Student();
        student.setName("Test Student");
        student.setEmail("student@test.com");
        student.setPassword(passwordEncoder.encode("password"));
        student.setMobile("9876543210");
        student = studentRepository.save(student);

        StudentInternship si = new StudentInternship();
        si.setStudent(student);
        si.setPlanName("Java Batch");
        si.setTotalFee(BigDecimal.valueOf(10000));
        si.setPaidAmount(BigDecimal.valueOf(10000));
        si.setRemainingAmount(BigDecimal.ZERO);
        si.setPaymentStatus(PaymentStatus.FULL);
        studentInternshipRepository.save(si);

        // Create student with no payment
        studentNoPayment = new Student();
        studentNoPayment.setName("No Pay Student");
        studentNoPayment.setEmail("nopay@test.com");
        studentNoPayment.setPassword(passwordEncoder.encode("password"));
        studentNoPayment.setMobile("9876543211");
        studentNoPayment = studentRepository.save(studentNoPayment);

        StudentInternship siNoPay = new StudentInternship();
        siNoPay.setStudent(studentNoPayment);
        siNoPay.setPlanName("Java Batch");
        siNoPay.setTotalFee(BigDecimal.valueOf(10000));
        siNoPay.setPaidAmount(BigDecimal.ZERO);
        siNoPay.setRemainingAmount(BigDecimal.valueOf(10000));
        siNoPay.setPaymentStatus(PaymentStatus.NOT_PAID);
        studentInternshipRepository.save(siNoPay);
    }

    // ─── Authentication guard tests ──────────────────────────────────────────────

    @Test
    void getMyAssessments_withoutAuth_returns403() throws Exception {
        mockMvc.perform(get("/api/student/assessments"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getMyAssessments_withAdminRole_returns403() throws Exception {
        mockMvc.perform(get("/api/student/assessments"))
                .andExpect(status().isForbidden());
    }

    // ─── Payment gate ─────────────────────────────────────────────────────────────

    @Test
    void getMyAssessments_studentWithFullPayment_returnsAssessments() throws Exception {
        mockMvc.perform(get("/api/student/assessments")
                .with(user("student@test.com").roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getMyAssessments_studentWithNoPayment_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/student/assessments")
                .with(user("nopay@test.com").roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ─── Access control ───────────────────────────────────────────────────────────

    @Test
    void getAssessmentDetail_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/student/assessments/99999")
                .with(user("student@test.com").roles("STUDENT")))
                .andExpect(status().isNotFound());
    }

    @Test
    void getQuestions_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/student/assessments/99999/questions")
                .with(user("student@test.com").roles("STUDENT")))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAssessmentDetail_anotherStudentsAssessment_returns403() throws Exception {
        // Create an assessment and assign it to student (not studentNoPayment)
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.APTITUDE_TEST);
        assessment.setTitle("Aptitude Test");
        assessment.setTimeLimitMinutes(30);
        assessment = assessmentRepository.save(assessment);

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        // studentNoPayment tries to access student's assessment
        mockMvc.perform(get("/api/student/assessments/" + sa.getId())
                .with(user("nopay@test.com").roles("STUDENT")))
                .andExpect(status().isForbidden());
    }

    // ─── Questions endpoint ───────────────────────────────────────────────────────

    @Test
    void getQuestions_ownAssessment_returnsQuestionsWithoutCorrectAnswerIndex() throws Exception {
        // Create MCQ assessment with a question
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.TECHNICAL_MCQ);
        assessment.setTitle("MCQ Test");
        assessment.setTimeLimitMinutes(30);
        assessment = assessmentRepository.save(assessment);

        // Add a question directly via repo
        com.webvibes.entity.Question q = new com.webvibes.entity.Question();
        q.setAssessment(assessment);
        q.setPrompt("What is Java?");
        q.setOptionA("A language");
        q.setOptionB("A coffee");
        q.setOptionC("A framework");
        q.setOptionD("An OS");
        q.setCorrectAnswerIndex(0);

        // Save question via assessment
        assessment.getQuestions().add(q);
        assessmentRepository.save(assessment);

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        String responseBody = mockMvc.perform(get("/api/student/assessments/" + sa.getId() + "/questions")
                .with(user("student@test.com").roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn().getResponse().getContentAsString();

        // Verify correctAnswerIndex is NOT in the response
        assert !responseBody.contains("correctAnswerIndex") : "correctAnswerIndex should not be in student response";
    }

    // ─── Submit endpoint ──────────────────────────────────────────────────────────

    @Test
    void submit_notFound_returns404() throws Exception {
        McqSubmitRequest req = new McqSubmitRequest();
        req.setAnswers(List.of());

        mockMvc.perform(post("/api/student/assessments/99999/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    @Test
    void submit_machineTest_shortSolution_returns400() throws Exception {
        // Create machine test assessment
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.MACHINE_TEST);
        assessment.setTitle("Machine Test");
        assessment.setProblemStatement("Build a REST API with Spring Boot that handles CRUD operations.");
        assessment = assessmentRepository.save(assessment);

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        MachineSubmitRequest req = new MachineSubmitRequest();
        req.setSolutionText("Short"); // < 10 chars

        mockMvc.perform(post("/api/student/assessments/" + sa.getId() + "/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void submit_machineTest_validSolution_returns200AndCompletes() throws Exception {
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.MACHINE_TEST);
        assessment.setTitle("Machine Test");
        assessment.setProblemStatement("Build a REST API with Spring Boot that handles CRUD operations.");
        assessment = assessmentRepository.save(assessment);

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        MachineSubmitRequest req = new MachineSubmitRequest();
        req.setSolutionText("This is my solution to the machine test problem.");

        mockMvc.perform(post("/api/student/assessments/" + sa.getId() + "/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void submit_alreadySubmitted_returns409() throws Exception {
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.MACHINE_TEST);
        assessment.setTitle("Machine Test");
        assessment.setProblemStatement("Build a REST API with Spring Boot that handles CRUD operations.");
        assessment = assessmentRepository.save(assessment);

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        MachineSubmitRequest req = new MachineSubmitRequest();
        req.setSolutionText("This is my solution to the machine test problem.");

        // First submission
        mockMvc.perform(post("/api/student/assessments/" + sa.getId() + "/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Second submission — should be 409
        mockMvc.perform(post("/api/student/assessments/" + sa.getId() + "/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    void submit_mcqTest_calculatesScoreCorrectly() throws Exception {
        // Create MCQ assessment with questions
        Assessment assessment = new Assessment();
        assessment.setType(AssessmentType.TECHNICAL_MCQ);
        assessment.setTitle("MCQ Test");
        assessment.setTimeLimitMinutes(30);
        assessment = assessmentRepository.save(assessment);

        com.webvibes.entity.Question q1 = new com.webvibes.entity.Question();
        q1.setAssessment(assessment);
        q1.setPrompt("Q1");
        q1.setOptionA("A");
        q1.setOptionB("B");
        q1.setOptionC("C");
        q1.setOptionD("D");
        q1.setCorrectAnswerIndex(0); // correct = A

        com.webvibes.entity.Question q2 = new com.webvibes.entity.Question();
        q2.setAssessment(assessment);
        q2.setPrompt("Q2");
        q2.setOptionA("A");
        q2.setOptionB("B");
        q2.setOptionC("C");
        q2.setOptionD("D");
        q2.setCorrectAnswerIndex(1); // correct = B

        assessment.getQuestions().add(q1);
        assessment.getQuestions().add(q2);
        assessment = assessmentRepository.save(assessment);

        // Get the saved question IDs
        Long q1Id = assessment.getQuestions().get(0).getId();
        Long q2Id = assessment.getQuestions().get(1).getId();

        StudentAssessment sa = new StudentAssessment();
        sa.setStudent(student);
        sa.setAssessment(assessment);
        sa.setAssignedAt(LocalDateTime.now());
        sa.setStatus(AssessmentStatus.PENDING);
        sa = studentAssessmentRepository.save(sa);

        // Answer q1 correctly (index 0), q2 incorrectly (index 0 instead of 1)
        McqSubmitRequest req = new McqSubmitRequest();
        AnswerDTO a1 = new AnswerDTO();
        a1.setQuestionId(q1Id);
        a1.setSelectedIndex(0); // correct
        AnswerDTO a2 = new AnswerDTO();
        a2.setQuestionId(q2Id);
        a2.setSelectedIndex(0); // wrong
        req.setAnswers(List.of(a1, a2));

        mockMvc.perform(post("/api/student/assessments/" + sa.getId() + "/submit")
                .with(user("student@test.com").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(1))
                .andExpect(jsonPath("$.total").value(2))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}
