package com.webvibes.controller;

import com.webvibes.dto.MessageResponse;
import com.webvibes.dto.UpiPaymentRequest;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    /**
     * Student submits their UPI UTR number after making a manual UPI payment.
     * Admin will verify and confirm via the admin panel.
     */
    @PostMapping("/upi-submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MessageResponse> submitUpiPayment(
            @Valid @RequestBody UpiPaymentRequest request,
            Principal principal) {

        StudentInternship si = studentInternshipRepository.findByStudentEmail(principal.getName())
                .orElseThrow(() -> new StudentInternshipNotFoundException("No internship plan assigned"));

        si.setUtrNumber(request.getUtrNumber());
        si.setPendingUtrType(request.getPaymentType());
        studentInternshipRepository.save(si);

        return ResponseEntity.ok(new MessageResponse(
                "Payment submitted successfully. Your UTR " + request.getUtrNumber() +
                " has been recorded. Admin will verify and update your status shortly."
        ));
    }
}
