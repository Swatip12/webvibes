package com.webvibes.controller;

import com.webvibes.dto.*;
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

    public StudentAssessmentController(AssessmentService assessmentService,
                                       StudentAssessmentRepository studentAssessmentRepository) {
        this.assessmentService = assessmentService;
        this.studentAssessmentRepository = studentAssessmentRepository;
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

        // Resolve studentAssessmentId — if id is an assessmentId, auto-enroll
        final Long saId;
        if (studentAssessmentRepository.existsById(id)) {
            saId = id;
        } else {
            saId = assessmentService.enrollStudentInAssessment(id, email);
        }

        // Pass raw body to service — service handles type resolution and casting
        return ResponseEntity.ok(assessmentService.submitAssessmentFromBody(saId, body, email));
    }
}
