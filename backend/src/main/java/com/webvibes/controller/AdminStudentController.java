package com.webvibes.controller;

import com.webvibes.dto.AdminPaymentUpdateRequest;
import com.webvibes.dto.AdminStudentDTO;
import com.webvibes.dto.AssignPlanRequest;
import com.webvibes.entity.PaymentStatus;
import com.webvibes.entity.Student;
import com.webvibes.entity.StudentInternship;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.repository.StudentRepository;
import com.webvibes.service.StudentInternshipService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private static final Logger logger = LoggerFactory.getLogger(AdminStudentController.class);

    private final StudentInternshipRepository studentInternshipRepository;
    private final StudentInternshipService studentInternshipService;
    private final StudentRepository studentRepository;

    public AdminStudentController(StudentInternshipRepository studentInternshipRepository,
                                  StudentInternshipService studentInternshipService,
                                  StudentRepository studentRepository) {
        this.studentInternshipRepository = studentInternshipRepository;
        this.studentInternshipService = studentInternshipService;
        this.studentRepository = studentRepository;
    }

    /**
     * Get ALL registered students. Students without a plan show planAssigned=false.
     * Optionally filter by paymentStatus (only applies to students with a plan).
     */
    @GetMapping
    public ResponseEntity<Page<AdminStudentDTO>> getAllStudents(
            @RequestParam(required = false) PaymentStatus paymentStatus,
            Pageable pageable) {
        logger.info("Admin fetching students, paymentStatus filter: {}", paymentStatus);

        if (paymentStatus != null) {
            // Filter mode: only students with matching payment status
            Page<StudentInternship> page = studentInternshipRepository.findByPaymentStatus(paymentStatus, pageable);
            return ResponseEntity.ok(page.map(this::toDTO));
        }

        // Default: show ALL students, with or without a plan
        Page<Student> allStudents = studentRepository.findAll(pageable);
        List<AdminStudentDTO> dtos = allStudents.getContent().stream()
                .map(student -> {
                    Optional<StudentInternship> si = studentInternshipRepository.findByStudentId(student.getId());
                    return si.map(this::toDTO)
                             .orElse(new AdminStudentDTO(student.getId(), student.getName(), student.getEmail(), student.getMobile()));
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(dtos, pageable, allStudents.getTotalElements()));
    }

    /**
     * Assign an internship plan to a student who doesn't have one yet.
     */
    @PostMapping("/{studentId}/assign-plan")
    public ResponseEntity<AdminStudentDTO> assignPlan(
            @PathVariable Long studentId,
            @Valid @RequestBody AssignPlanRequest request) {
        logger.info("Admin assigning plan to studentId: {}", studentId);

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (studentInternshipRepository.findByStudentId(studentId).isPresent()) {
            return ResponseEntity.badRequest().build(); // plan already assigned
        }

        StudentInternship si = new StudentInternship();
        si.setStudent(student);
        si.setPlanName(request.getPlanName());
        si.setTotalFee(request.getTotalFee());
        si.setPaidAmount(BigDecimal.ZERO);
        si.setRemainingAmount(request.getTotalFee());
        si.setPaymentStatus(PaymentStatus.NOT_PAID);
        si.setUpdatedAt(LocalDateTime.now());

        StudentInternship saved = studentInternshipRepository.save(si);
        return ResponseEntity.ok(toDTO(saved));
    }

    /**
     * Update payment details for a student.
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
