package com.webvibes.controller;

import com.webvibes.dto.StudentAssessmentDTO;
import com.webvibes.dto.UpdateStatusRequest;
import com.webvibes.entity.AssessmentStatus;
import com.webvibes.entity.AssessmentType;
import com.webvibes.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/student-assessments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentAssessmentController {

    private final AssessmentService assessmentService;

    public AdminStudentAssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentAssessmentDTO>> getAllStudentAssessments(
            @RequestParam(required = false) AssessmentType assessmentType,
            @RequestParam(required = false) AssessmentStatus assessmentStatus) {
        return ResponseEntity.ok(assessmentService.getAllStudentAssessments(assessmentType, assessmentStatus));
    }

    @PutMapping("/{studentAssessmentId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long studentAssessmentId,
            @RequestBody UpdateStatusRequest req) {
        assessmentService.updateStudentAssessmentStatus(studentAssessmentId, req.getStatus());
        return ResponseEntity.noContent().build();
    }
}
