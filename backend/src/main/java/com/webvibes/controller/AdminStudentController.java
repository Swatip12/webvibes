package com.webvibes.controller;

import com.webvibes.dto.AdminPaymentUpdateRequest;
import com.webvibes.dto.AdminStudentDTO;
import com.webvibes.entity.PaymentStatus;
import com.webvibes.entity.StudentInternship;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.service.StudentInternshipService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private static final Logger logger = LoggerFactory.getLogger(AdminStudentController.class);

    private final StudentInternshipRepository studentInternshipRepository;
    private final StudentInternshipService studentInternshipService;

    public AdminStudentController(StudentInternshipRepository studentInternshipRepository,
                                  StudentInternshipService studentInternshipService) {
        this.studentInternshipRepository = studentInternshipRepository;
        this.studentInternshipService = studentInternshipService;
    }

    /**
     * Get all students with their internship/payment details, paginated.
     * Optionally filter by paymentStatus.
     */
    @GetMapping
    public ResponseEntity<Page<AdminStudentDTO>> getAllStudents(
            @RequestParam(required = false) PaymentStatus paymentStatus,
            Pageable pageable) {
        logger.info("Admin fetching students, paymentStatus filter: {}", paymentStatus);

        Page<StudentInternship> page = (paymentStatus != null)
                ? studentInternshipRepository.findByPaymentStatus(paymentStatus, pageable)
                : studentInternshipRepository.findAll(pageable);

        Page<AdminStudentDTO> result = page.map(this::toDTO);
        return ResponseEntity.ok(result);
    }

    /**
     * Update payment details for a student.
     * Recalculates remainingAmount = totalFee - paidAmount.
     */
    @PutMapping("/{studentId}/payment")
    public ResponseEntity<AdminStudentDTO> updatePayment(
            @PathVariable Long studentId,
            @RequestBody AdminPaymentUpdateRequest request) {
        logger.info("Admin updating payment for studentId: {}", studentId);

        StudentInternship updated = studentInternshipService.updatePayment(studentId, request);
        return ResponseEntity.ok(toDTO(updated));
    }

    private AdminStudentDTO toDTO(StudentInternship si) {
        return new AdminStudentDTO(
                si.getStudent().getId(),
                si.getStudent().getName(),
                si.getStudent().getEmail(),
                si.getStudent().getMobile(),
                si.getPlanName(),
                si.getTotalFee(),
                si.getPaidAmount(),
                si.getRemainingAmount(),
                si.getPaymentStatus()
        );
    }
}
