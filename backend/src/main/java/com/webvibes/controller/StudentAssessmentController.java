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

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDetailDTO> getAssessmentDetail(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        // Auto-resolve: if id is an assessmentId, enroll and get the studentAssessmentId
        if (!studentAssessmentRepository.existsById(id)) {
            id = assessmentService.enrollStudentInAssessment(id, email);
        }
        return ResponseEntity.ok(assessmentService.getAssessmentForStudent(id, email));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<QuestionStudentDTO>> getQuestions(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        // Auto-resolve: if id is an assessmentId, enroll and get the studentAssessmentId
        if (!studentAssessmentRepository.existsById(id)) {
            id = assessmentService.enrollStudentInAssessment(id, email);
        }
        return ResponseEntity.ok(assessmentService.getQuestionsForStudent(id, email));
    }

    /**
     * Unified submit endpoint — dispatches based on assessment type.
     * Accepts MCQ answers, machine test solution, or empty body for mock interview.
     * Supports both studentAssessmentId and raw assessmentId (auto-resolves).
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmitResponse> submit(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body,
            Authentication authentication) {
        String email = authentication.getName();

        // Try to find by studentAssessmentId first
        StudentAssessment sa = studentAssessmentRepository.findById(id).orElse(null);

        // If not found, treat id as an assessmentId and find the student's assignment
        if (sa == null) {
            Long resolvedSaId = assessmentService.enrollStudentInAssessment(id, email);
            sa = studentAssessmentRepository.findById(resolvedSaId)
                    .orElseThrow(() -> new AssessmentNotFoundException(
                            "StudentAssessment not found for assessmentId: " + id));
            id = resolvedSaId;
        }

        AssessmentType type = sa.getAssessment().getType();
        Object submitRequest;

        if (type == AssessmentType.MACHINE_TEST) {
            submitRequest = objectMapper.convertValue(body != null ? body : Map.of(), MachineSubmitRequest.class);
        } else if (type == AssessmentType.MOCK_INTERVIEW) {
            submitRequest = new McqSubmitRequest();
        } else {
            submitRequest = objectMapper.convertValue(body != null ? body : Map.of(), McqSubmitRequest.class);
        }

        return ResponseEntity.ok(assessmentService.submitAssessment(id, submitRequest, email));
    }
}
