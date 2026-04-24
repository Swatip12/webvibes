package com.webvibes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.*;
import com.webvibes.entity.AssessmentType;
import com.webvibes.entity.StudentAssessment;
import com.webvibes.exception.AssessmentNotFoundException;
import com.webvibes.repository.StudentAssessmentRepository;
import com.webvibes.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/assessments")
@PreAuthorize("hasRole('STUDENT')")
public class StudentAssessmentController {

    private final AssessmentService assessmentService;
    private final StudentAssessmentRepository studentAssessmentRepository;
    private final ObjectMapper objectMapper;

    public StudentAssessmentController(AssessmentService assessmentService,
                                       StudentAssessmentRepository studentAssessmentRepository,
                                       ObjectMapper objectMapper) {
        this.assessmentService = assessmentService;
        this.studentAssessmentRepository = studentAssessmentRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<StudentAssessmentDTO>> getMyAssessments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(assessmentService.getStudentAssessments(email));
    }

    /**
     * Auto-enroll: given a raw assessmentId, find or create the StudentAssessment
     * for this student and return its ID. Used when students access a shared test link.
     */
    @PostMapping("/enroll/{assessmentId}")
    public ResponseEntity<Map<String, Long>> enrollInAssessment(
            @PathVariable Long assessmentId,
            Authentication authentication) {
        String email = authentication.getName();
        Long saId = assessmentService.enrollStudentInAssessment(assessmentId, email);
        return ResponseEntity.ok(Map.of("studentAssessmentId", saId));
    }

    @GetMapping("/progress")
    public ResponseEntity<StudentProgressDTO> getMyProgress(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(assessmentService.getStudentProgress(email));
    }

    @GetMapping("/{studentAssessmentId}")
    public ResponseEntity<AssessmentDetailDTO> getAssessmentDetail(
            @PathVariable Long studentAssessmentId,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(assessmentService.getAssessmentForStudent(studentAssessmentId, email));
    }

    @GetMapping("/{studentAssessmentId}/questions")
    public ResponseEntity<List<QuestionStudentDTO>> getQuestions(
            @PathVariable Long studentAssessmentId,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(assessmentService.getQuestionsForStudent(studentAssessmentId, email));
    }

    /**
     * Unified submit endpoint — dispatches based on assessment type.
     * Accepts MCQ answers, machine test solution, or empty body for mock interview.
     */
    @PostMapping("/{studentAssessmentId}/submit")
    public ResponseEntity<SubmitResponse> submit(
            @PathVariable Long studentAssessmentId,
            @RequestBody(required = false) Map<String, Object> body,
            Authentication authentication) {
        String email = authentication.getName();

        StudentAssessment sa = studentAssessmentRepository.findById(studentAssessmentId)
                .orElseThrow(() -> new AssessmentNotFoundException(
                        "StudentAssessment not found with id: " + studentAssessmentId));

        AssessmentType type = sa.getAssessment().getType();
        Object submitRequest;

        if (type == AssessmentType.MACHINE_TEST) {
            submitRequest = objectMapper.convertValue(body != null ? body : Map.of(), MachineSubmitRequest.class);
        } else if (type == AssessmentType.MOCK_INTERVIEW) {
            // Mock interview — no body needed, pass empty MCQ request
            submitRequest = new McqSubmitRequest();
        } else {
            submitRequest = objectMapper.convertValue(body != null ? body : Map.of(), McqSubmitRequest.class);
        }

        return ResponseEntity.ok(assessmentService.submitAssessment(studentAssessmentId, submitRequest, email));
    }
}
