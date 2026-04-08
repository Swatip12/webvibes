package com.webvibes.controller;

import com.webvibes.dto.DashboardResponse;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.service.StudentInternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/student")
public class StudentDashboardController {

    @Autowired
    private StudentInternshipService studentInternshipService;

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        DashboardResponse response = studentInternshipService.getDashboard(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/receipt/{paymentType}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Resource> getReceipt(@PathVariable String paymentType,
                                               Authentication authentication) throws IOException {
        String email = authentication.getName();

        StudentInternship si = studentInternshipRepository.findByStudentEmail(email)
                .orElseThrow(() -> new StudentInternshipNotFoundException("No internship plan assigned"));

        String receiptPath;
        if ("registration".equalsIgnoreCase(paymentType)) {
            receiptPath = si.getRegistrationReceiptPath();
        } else if ("remaining".equalsIgnoreCase(paymentType)) {
            receiptPath = si.getRemainingReceiptPath();
        } else {
            return ResponseEntity.badRequest().build();
        }

        if (receiptPath == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(receiptPath);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"receipt_" + paymentType + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.length())
                .body(resource);
    }
}
