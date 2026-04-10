package com.webvibes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.*;
import com.webvibes.entity.AssessmentType;
import com.webvibes.entity.StudentAssessment;import com.webvibes.exception.AssessmentNotFoundException;
import com.webvibes.repository.StudentAssessmentRepository;
import com.webvibes.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
     * Unified submit endpoint — dispatches to MCQ or machine test logic based on assessment type.
     * Accepts either McqSubmitRequest (with "answers" field) or MachineSubmitRequest (with "solutionText" field).
     */
    @PostMapping("/{studentAssessmentId}/submit")
    public ResponseEntity<SubmitResponse> submit(
            @PathVariable Long studentAssessmentId,
            @RequestBody Object body,
            Authentication authentication) {
        String email = authentication.getName();

        // Determine assessment type to route to the correct submit handler
        StudentAssessment sa = studentAssessmentRepository.findById(studentAssessmentId)
                .orElseThrow(() -> new AssessmentNotFoundException(
                        "StudentAssessment not found with id: " + studentAssessmentId));

        AssessmentType type = sa.getAssessment().getType();
        Object submitRequest;

        if (type == AssessmentType.MACHINE_TEST) {
            submitRequest = objectMapper.convertValue(body, MachineSubmitRequest.class);
        } else {
            submitRequest = objectMapper.convertValue(body, McqSubmitRequest.class);
        }

        return ResponseEntity.ok(assessmentService.submitAssessment(studentAssessmentId, submitRequest, email));
    }
}
