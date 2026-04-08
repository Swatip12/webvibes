package com.webvibes.controller;

import com.webvibes.dto.PaymentVerifyRequest;
import com.webvibes.dto.PaymentVerifyResponse;
import com.webvibes.dto.RazorpayOrderResponse;
import com.webvibes.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Creates a Razorpay order for the ₹1000 registration fee.
     * Requires ROLE_STUDENT.
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RazorpayOrderResponse> createRegistrationOrder(Principal principal) {
        RazorpayOrderResponse response = paymentService.createRegistrationOrder(principal.getName());
        return ResponseEntity.ok(response);
    }

    /**
     * Creates a Razorpay order for the remaining balance.
     * Requires ROLE_STUDENT.
     */
    @PostMapping("/remaining")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RazorpayOrderResponse> createRemainingOrder(Principal principal) {
        RazorpayOrderResponse response = paymentService.createRemainingOrder(principal.getName());
        return ResponseEntity.ok(response);
    }

    /**
     * Verifies the Razorpay signature and records the payment.
     * Requires ROLE_STUDENT.
     */
    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<PaymentVerifyResponse> verifyPayment(
            @RequestBody PaymentVerifyRequest request,
            Principal principal) {
        PaymentVerifyResponse response = paymentService.verifyAndRecord(request, principal.getName());
        return ResponseEntity.ok(response);
    }
}
