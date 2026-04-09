package com.webvibes.controller;

import com.webvibes.dto.*;
import com.webvibes.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assessments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAssessmentController {

    private final AssessmentService assessmentService;

    public AdminAssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<AssessmentDTO> createAssessment(@Valid @RequestBody CreateAssessmentRequest req) {
        return ResponseEntity.ok(assessmentService.createAssessment(req));
    }

    @GetMapping
    public ResponseEntity<Page<AssessmentDTO>> getAssessments(Pageable pageable) {
        return ResponseEntity.ok(assessmentService.getAssessments(pageable));
    }

    @GetMapping("/{assessmentId}")
    public ResponseEntity<AssessmentDetailDTO> getAssessmentById(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(assessmentId));
    }

    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long assessmentId) {
        assessmentService.deleteAssessment(assessmentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{assessmentId}/questions")
    public ResponseEntity<QuestionDTO> addQuestion(
            @PathVariable Long assessmentId,
            @Valid @RequestBody CreateQuestionRequest req) {
        return ResponseEntity.ok(assessmentService.addQuestion(assessmentId, req));
    }

    @DeleteMapping("/{assessmentId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId) {
        assessmentService.deleteQuestion(assessmentId, questionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{assessmentId}/assign")
    public ResponseEntity<AssignResponse> assignAssessment(
            @PathVariable Long assessmentId,
            @RequestBody AssignRequest req) {
        return ResponseEntity.ok(assessmentService.assignAssessment(assessmentId, req));
    }

    @GetMapping("/{assessmentId}/students")
    public ResponseEntity<List<StudentAssessmentDTO>> getAssignedStudents(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getAssignedStudents(assessmentId));
    }

    @GetMapping("/{assessmentId}/results")
    public ResponseEntity<List<ResultDTO>> getResults(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getResults(assessmentId));
    }
}
