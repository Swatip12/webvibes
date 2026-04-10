package com.webvibes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.*;
import com.webvibes.entity.*;
import com.webvibes.exception.*;
import com.webvibes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssessmentService {

    @Autowired private AssessmentRepository assessmentRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private StudentAssessmentRepository studentAssessmentRepository;
    @Autowired private SubmissionRepository submissionRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private StudentInternshipRepository studentInternshipRepository;
    @Autowired private ObjectMapper objectMapper;

    // ─── 5.1 Assessment CRUD ────────────────────────────────────────────────────

    public AssessmentDTO createAssessment(CreateAssessmentRequest req) {
        validateTypeSpecificFields(req);

        Assessment a = new Assessment();
        a.setType(req.getType());
        a.setTitle(req.getTitle());
        a.setDescription(req.getDescription());
        a.setScheduledAt(req.getScheduledAt());
        a.setVideoLink(req.getVideoLink());
        a.setProblemStatement(req.getProblemStatement());
        a.setTimeLimitMinutes(req.getTimeLimitMinutes());

        Assessment saved = assessmentRepository.save(a);
        return toAssessmentDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<AssessmentDTO> getAssessments(Pageable pageable) {
        return assessmentRepository.findAll(pageable).map(this::toAssessmentDTO);
    }

    @Transactional(readOnly = true)
    public AssessmentDetailDTO getAssessmentById(Long assessmentId) {
        Assessment a = findAssessmentOrThrow(assessmentId);
        return toAssessmentDetailDTO(a);
    }

    public void deleteAssessment(Long assessmentId) {
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new AssessmentNotFoundException("Assessment not found with id: " + assessmentId);
        }
        assessmentRepository.deleteById(assessmentId);
    }

    // ─── 5.5 Question management ────────────────────────────────────────────────

    public QuestionDTO addQuestion(Long assessmentId, CreateQuestionRequest req) {
        Assessment a = findAssessmentOrThrow(assessmentId);

        if (a.getType() == AssessmentType.MOCK_INTERVIEW || a.getType() == AssessmentType.MACHINE_TEST) {
            throw new InvalidAssessmentTypeOperationException(
                    "Questions are not applicable for this assessment type");
        }

        Question q = new Question();
        q.setAssessment(a);
        q.setPrompt(req.getPrompt());
        q.setOptionA(req.getOptionA());
        q.setOptionB(req.getOptionB());
        q.setOptionC(req.getOptionC());
        q.setOptionD(req.getOptionD());
        q.setCorrectAnswerIndex(req.getCorrectAnswerIndex());

        Question saved = questionRepository.save(q);
        return toQuestionDTO(saved);
    }

    public void deleteQuestion(Long assessmentId, Long questionId) {
        findAssessmentOrThrow(assessmentId);
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new AssessmentNotFoundException("Question not found with id: " + questionId));
        questionRepository.delete(q);
    }


    // ─── 5.8 Assignment methods ─────────────────────────────────────────────────

    public AssignResponse assignAssessment(Long assessmentId, AssignRequest req) {
        Assessment assessment = findAssessmentOrThrow(assessmentId);

        List<Student> candidates = new ArrayList<>();
        List<Long> skippedIds = new ArrayList<>();

        if (req.getBatchName() != null && !req.getBatchName().isBlank()) {
            // Batch assignment: resolve by planName
            List<StudentInternship> internships = studentInternshipRepository.findByPlanName(req.getBatchName());
            candidates = internships.stream()
                    .map(StudentInternship::getStudent)
                    .collect(Collectors.toList());
        } else if (req.getStudentIds() != null) {
            // Individual assignment
            for (Long studentId : req.getStudentIds()) {
                studentRepository.findById(studentId).ifPresentOrElse(
                        candidates::add,
                        () -> skippedIds.add(studentId)
                );
            }
        }

        List<Long> alreadyAssigned = new ArrayList<>();
        int assigned = 0;

        for (Student student : candidates) {
            if (studentAssessmentRepository.existsByStudentIdAndAssessmentId(student.getId(), assessmentId)) {
                alreadyAssigned.add(student.getId());
                continue;
            }

            StudentAssessment sa = new StudentAssessment();
            sa.setStudent(student);
            sa.setAssessment(assessment);
            sa.setAssignedAt(LocalDateTime.now());
            // MOCK_INTERVIEW starts as UPCOMING; all others start as PENDING
            sa.setStatus(assessment.getType() == AssessmentType.MOCK_INTERVIEW
                    ? AssessmentStatus.UPCOMING
                    : AssessmentStatus.PENDING);

            studentAssessmentRepository.save(sa);
            assigned++;
        }

        return new AssignResponse(assigned, skippedIds, alreadyAssigned);
    }

    @Transactional(readOnly = true)
    public List<StudentAssessmentDTO> getAssignedStudents(Long assessmentId) {
        findAssessmentOrThrow(assessmentId);
        return studentAssessmentRepository.findByAssessmentId(assessmentId).stream()
                .map(this::toStudentAssessmentDTO)
                .collect(Collectors.toList());
    }

    // ─── 5.12 Student-facing methods ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<StudentAssessmentDTO> getStudentAssessments(String studentEmail) {
        Student student = findStudentByEmailOrThrow(studentEmail);

        // Payment gate: return empty list if not FULL
        StudentInternship si = studentInternshipRepository.findByStudentId(student.getId()).orElse(null);
        if (si == null || si.getPaymentStatus() != PaymentStatus.FULL) {
            return List.of();
        }

        return studentAssessmentRepository.findByStudentId(student.getId()).stream()
                .map(this::toStudentAssessmentDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentProgressDTO getStudentProgress(String studentEmail) {
        Student student = findStudentByEmailOrThrow(studentEmail);
        List<StudentAssessment> all = studentAssessmentRepository.findByStudentId(student.getId());

        StudentProgressDTO dto = new StudentProgressDTO();
        dto.setTotalAssigned(all.size());
        dto.setTotalCompleted((int) all.stream().filter(sa -> sa.getStatus() == AssessmentStatus.COMPLETED).count());

        for (AssessmentType type : AssessmentType.values()) {
            List<StudentAssessment> byType = all.stream()
                    .filter(sa -> sa.getAssessment().getType() == type)
                    .collect(Collectors.toList());
            int total = byType.size();
            int completed = (int) byType.stream().filter(sa -> sa.getStatus() == AssessmentStatus.COMPLETED).count();
            switch (type) {
                case MOCK_INTERVIEW   -> { dto.setMockInterviewTotal(total);  dto.setMockInterviewCompleted(completed); }
                case APTITUDE_TEST    -> { dto.setAptitudeTestTotal(total);   dto.setAptitudeTestCompleted(completed); }
                case MACHINE_TEST     -> { dto.setMachineTestTotal(total);    dto.setMachineTestCompleted(completed); }
                case TECHNICAL_MCQ   -> { dto.setTechnicalMcqTotal(total);   dto.setTechnicalMcqCompleted(completed); }
            }
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public AssessmentDetailDTO getAssessmentForStudent(Long studentAssessmentId, String studentEmail) {
        StudentAssessment sa = findStudentAssessmentOrThrow(studentAssessmentId);
        verifyOwnership(sa, studentEmail);
        AssessmentDetailDTO dto = toAssessmentDetailDTO(sa.getAssessment());
        dto.setStatus(sa.getStatus());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<QuestionStudentDTO> getQuestionsForStudent(Long studentAssessmentId, String studentEmail) {
        StudentAssessment sa = findStudentAssessmentOrThrow(studentAssessmentId);
        verifyOwnership(sa, studentEmail);

        return sa.getAssessment().getQuestions().stream()
                .map(q -> new QuestionStudentDTO(
                        q.getId(), q.getPrompt(),
                        q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()))
                .collect(Collectors.toList());
    }


    // ─── 5.15 Submission methods ─────────────────────────────────────────────────

    public SubmitResponse submitAssessment(Long studentAssessmentId, Object submitRequest, String studentEmail) {
        StudentAssessment sa = findStudentAssessmentOrThrow(studentAssessmentId);
        verifyOwnership(sa, studentEmail);

        if (submissionRepository.existsByStudentAssessmentId(studentAssessmentId)) {
            throw new AssessmentAlreadySubmittedException("Assessment already submitted");
        }

        AssessmentType type = sa.getAssessment().getType();
        Submission submission = new Submission();
        submission.setStudentAssessment(sa);
        submission.setSubmittedAt(LocalDateTime.now());

        Integer score = null;
        Integer total = null;

        if (type == AssessmentType.TECHNICAL_MCQ || type == AssessmentType.APTITUDE_TEST) {
            McqSubmitRequest mcqReq = (McqSubmitRequest) submitRequest;
            List<Question> questions = sa.getAssessment().getQuestions();
            total = questions.size();

            // Build a map of questionId -> correctAnswerIndex for fast lookup
            Map<Long, Integer> correctAnswers = questions.stream()
                    .collect(Collectors.toMap(Question::getId, Question::getCorrectAnswerIndex));

            score = 0;
            if (mcqReq.getAnswers() != null) {
                for (AnswerDTO answer : mcqReq.getAnswers()) {
                    Integer correct = correctAnswers.get(answer.getQuestionId());
                    if (correct != null && correct.equals(answer.getSelectedIndex())) {
                        score++;
                    }
                }
            }

            try {
                submission.setAnswersJson(objectMapper.writeValueAsString(mcqReq.getAnswers()));
            } catch (JsonProcessingException e) {
                submission.setAnswersJson("[]");
            }
            submission.setScore(score);

        } else if (type == AssessmentType.MACHINE_TEST) {
            MachineSubmitRequest machineReq = (MachineSubmitRequest) submitRequest;
            String solution = machineReq.getSolutionText();
            if (solution == null || solution.length() < 10) {
                throw new InvalidAssessmentTypeOperationException("Solution must be at least 10 characters");
            }
            submission.setSolutionText(solution);
        } else if (type == AssessmentType.MOCK_INTERVIEW) {
            // Mock interviews are marked complete when the student joins/confirms attendance.
            // No answers or solution text required.
            submission.setAnswersJson("{}");
        }

        submissionRepository.save(submission);

        sa.setStatus(AssessmentStatus.COMPLETED);
        studentAssessmentRepository.save(sa);

        return new SubmitResponse(score, total, AssessmentStatus.COMPLETED);
    }

    public void updateStudentAssessmentStatus(Long studentAssessmentId, AssessmentStatus status) {
        StudentAssessment sa = findStudentAssessmentOrThrow(studentAssessmentId);
        sa.setStatus(status);
        studentAssessmentRepository.save(sa);
    }

    // ─── 5.20 Admin results methods ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ResultDTO> getResults(Long assessmentId) {
        findAssessmentOrThrow(assessmentId);
        return studentAssessmentRepository.findByAssessmentId(assessmentId).stream()
                .map(this::toResultDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentAssessmentDTO> getAllStudentAssessments(AssessmentType assessmentType, AssessmentStatus assessmentStatus) {
        List<StudentAssessment> results;

        if (assessmentType != null && assessmentStatus != null) {
            results = studentAssessmentRepository.findByAssessmentTypeAndStatus(assessmentType, assessmentStatus);
        } else if (assessmentType != null) {
            results = studentAssessmentRepository.findByAssessmentType(assessmentType);
        } else if (assessmentStatus != null) {
            results = studentAssessmentRepository.findByStatus(assessmentStatus);
        } else {
            results = studentAssessmentRepository.findAll();
        }

        return results.stream().map(this::toStudentAssessmentDTO).collect(Collectors.toList());
    }


    // ─── Private helpers ─────────────────────────────────────────────────────────

    private void validateTypeSpecificFields(CreateAssessmentRequest req) {
        AssessmentType type = req.getType();
        if (type == null) return;

        switch (type) {
            case MOCK_INTERVIEW -> {
                if (req.getScheduledAt() == null || req.getVideoLink() == null || req.getVideoLink().isBlank()) {
                    throw new InvalidAssessmentTypeOperationException(
                            "MOCK_INTERVIEW requires scheduledAt and videoLink");
                }
            }
            case MACHINE_TEST -> {
                String ps = req.getProblemStatement();
                if (ps == null || ps.length() < 20) {
                    throw new InvalidAssessmentTypeOperationException(
                            "MACHINE_TEST requires problemStatement of at least 20 characters");
                }
            }
            case TECHNICAL_MCQ, APTITUDE_TEST -> {
                Integer tl = req.getTimeLimitMinutes();
                if (tl == null || tl < 1 || tl > 180) {
                    throw new InvalidAssessmentTypeOperationException(
                            "MCQ/APTITUDE requires timeLimitMinutes between 1 and 180");
                }
            }
        }
    }

    private Assessment findAssessmentOrThrow(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new AssessmentNotFoundException("Assessment not found with id: " + id));
    }

    private StudentAssessment findStudentAssessmentOrThrow(Long id) {
        return studentAssessmentRepository.findById(id)
                .orElseThrow(() -> new AssessmentNotFoundException("StudentAssessment not found with id: " + id));
    }

    private Student findStudentByEmailOrThrow(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new AssessmentAccessDeniedException("Student not found: " + email));
    }

    private void verifyOwnership(StudentAssessment sa, String studentEmail) {
        if (!sa.getStudent().getEmail().equals(studentEmail)) {
            throw new AssessmentAccessDeniedException("Access denied to this assessment");
        }
    }

    private AssessmentDTO toAssessmentDTO(Assessment a) {
        return new AssessmentDTO(
                a.getId(), a.getType(), a.getTitle(), a.getDescription(),
                a.getCreatedAt(), a.getQuestions().size());
    }

    private AssessmentDetailDTO toAssessmentDetailDTO(Assessment a) {
        return new AssessmentDetailDTO(
                a.getId(), a.getTitle(), a.getDescription(), a.getType(),
                a.getScheduledAt(), a.getVideoLink(), a.getProblemStatement(),
                a.getTimeLimitMinutes(), a.getCreatedAt());
    }

    private QuestionDTO toQuestionDTO(Question q) {
        return new QuestionDTO(q.getId(), q.getPrompt(),
                q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD(),
                q.getCorrectAnswerIndex());
    }

    private StudentAssessmentDTO toStudentAssessmentDTO(StudentAssessment sa) {
        Assessment a = sa.getAssessment();
        return new StudentAssessmentDTO(
                sa.getId(), a.getId(), a.getTitle(), a.getType(),
                sa.getStatus(), a.getScheduledAt(), a.getTimeLimitMinutes());
    }

    private ResultDTO toResultDTO(StudentAssessment sa) {
        Student student = sa.getStudent();
        Submission submission = submissionRepository.findByStudentAssessmentId(sa.getId()).orElse(null);

        return new ResultDTO(
                sa.getId(),
                student.getName(),
                student.getEmail(),
                sa.getStatus(),
                submission != null ? submission.getScore() : null,
                submission != null ? sa.getAssessment().getQuestions().size() : null,
                submission != null ? submission.getSolutionText() : null,
                sa.getAssessment().getScheduledAt(),
                submission != null ? submission.getSubmittedAt() : null);
    }
}
