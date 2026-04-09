package com.webvibes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.CreateAssessmentRequest;
import com.webvibes.dto.CreateQuestionRequest;
import com.webvibes.dto.AssignRequest;
import com.webvibes.entity.AssessmentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AdminAssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ─── Authentication guard tests ──────────────────────────────────────────────

    @Test
    void createAssessment_withoutAuth_returns403() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void createAssessment_withStudentRole_returns403() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    // ─── Assessment CRUD ─────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void createAptitudeAssessment_validRequest_returns200() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Java Aptitude Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(60);
        req.setDescription("Basic Java aptitude");

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Java Aptitude Test"))
                .andExpect(jsonPath("$.type").value("APTITUDE_TEST"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMockInterviewAssessment_validRequest_returns200() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Mock Interview Round 1");
        req.setType(AssessmentType.MOCK_INTERVIEW);
        req.setScheduledAt(LocalDateTime.now().plusDays(7));
        req.setVideoLink("https://meet.google.com/abc-defg-hij");

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("MOCK_INTERVIEW"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMockInterviewAssessment_missingVideoLink_returns400() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Mock Interview");
        req.setType(AssessmentType.MOCK_INTERVIEW);
        req.setScheduledAt(LocalDateTime.now().plusDays(7));
        // videoLink intentionally missing

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMachineTestAssessment_validRequest_returns200() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Machine Test 1");
        req.setType(AssessmentType.MACHINE_TEST);
        req.setProblemStatement("Build a REST API with Spring Boot that handles CRUD operations for a simple entity.");

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("MACHINE_TEST"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMachineTestAssessment_shortProblemStatement_returns400() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Machine Test");
        req.setType(AssessmentType.MACHINE_TEST);
        req.setProblemStatement("Too short"); // < 20 chars

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMcqAssessment_invalidTimeLimitZero_returns400() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("MCQ Test");
        req.setType(AssessmentType.TECHNICAL_MCQ);
        req.setTimeLimitMinutes(0); // invalid

        mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssessments_returns200WithPagedResult() throws Exception {
        mockMvc.perform(get("/api/admin/assessments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssessmentById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/admin/assessments/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteAssessment_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/admin/assessments/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createAndDeleteAssessment_returns204() throws Exception {
        // Create
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("To Delete");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Delete
        mockMvc.perform(delete("/api/admin/assessments/" + id))
                .andExpect(status().isNoContent());

        // Verify gone
        mockMvc.perform(get("/api/admin/assessments/" + id))
                .andExpect(status().isNotFound());
    }

    // ─── Question management ─────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void addQuestion_toAptitudeAssessment_returns200() throws Exception {
        // Create assessment first
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Aptitude Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(45);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Add question
        CreateQuestionRequest qReq = new CreateQuestionRequest();
        qReq.setPrompt("What is 2 + 2?");
        qReq.setOptionA("3");
        qReq.setOptionB("4");
        qReq.setOptionC("5");
        qReq.setOptionD("6");
        qReq.setCorrectAnswerIndex(1);

        mockMvc.perform(post("/api/admin/assessments/" + assessmentId + "/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(qReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prompt").value("What is 2 + 2?"))
                .andExpect(jsonPath("$.correctAnswerIndex").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addQuestion_toMockInterviewAssessment_returns400() throws Exception {
        // Create mock interview
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Mock Interview");
        req.setType(AssessmentType.MOCK_INTERVIEW);
        req.setScheduledAt(LocalDateTime.now().plusDays(3));
        req.setVideoLink("https://meet.google.com/test");

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Try to add question — should fail
        CreateQuestionRequest qReq = new CreateQuestionRequest();
        qReq.setPrompt("What is your name?");
        qReq.setOptionA("A");
        qReq.setOptionB("B");
        qReq.setOptionC("C");
        qReq.setOptionD("D");
        qReq.setCorrectAnswerIndex(0);

        mockMvc.perform(post("/api/admin/assessments/" + assessmentId + "/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(qReq)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addQuestion_toMachineTestAssessment_returns400() throws Exception {
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Machine Test");
        req.setType(AssessmentType.MACHINE_TEST);
        req.setProblemStatement("Build a REST API with Spring Boot that handles CRUD operations.");

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        CreateQuestionRequest qReq = new CreateQuestionRequest();
        qReq.setPrompt("What is Java?");
        qReq.setOptionA("A");
        qReq.setOptionB("B");
        qReq.setOptionC("C");
        qReq.setOptionD("D");
        qReq.setCorrectAnswerIndex(0);

        mockMvc.perform(post("/api/admin/assessments/" + assessmentId + "/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(qReq)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteQuestion_notFound_returns404() throws Exception {
        // Create assessment
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("MCQ Test");
        req.setType(AssessmentType.TECHNICAL_MCQ);
        req.setTimeLimitMinutes(30);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(delete("/api/admin/assessments/" + assessmentId + "/questions/99999"))
                .andExpect(status().isNotFound());
    }

    // ─── Assignment ───────────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignAssessment_withNonExistentStudentIds_returnsSkippedIds() throws Exception {
        // Create assessment
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Assign Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Assign to non-existent student IDs
        AssignRequest assignReq = new AssignRequest();
        assignReq.setStudentIds(List.of(99991L, 99992L));

        mockMvc.perform(post("/api/admin/assessments/" + assessmentId + "/assign")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assigned").value(0))
                .andExpect(jsonPath("$.skippedIds").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignedStudents_emptyList_returns200() throws Exception {
        // Create assessment
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Students Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/admin/assessments/" + assessmentId + "/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getResults_emptyList_returns200() throws Exception {
        // Create assessment
        CreateAssessmentRequest req = new CreateAssessmentRequest();
        req.setTitle("Results Test");
        req.setType(AssessmentType.APTITUDE_TEST);
        req.setTimeLimitMinutes(30);

        MvcResult result = mockMvc.perform(post("/api/admin/assessments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Long assessmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/admin/assessments/" + assessmentId + "/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
