package com.webvibes.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.webvibes.dto.PaymentVerifyRequest;
import com.webvibes.dto.PaymentVerifyResponse;
import com.webvibes.dto.RazorpayOrderResponse;
import com.webvibes.entity.PaymentStatus;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.OverpaymentException;
import com.webvibes.exception.PaymentVerificationException;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final BigDecimal REGISTRATION_FEE = new BigDecimal("1000");
    private static final long REGISTRATION_FEE_PAISE = 100000L;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    @Autowired
    private ReceiptService receiptService;

    /**
     * Creates a Razorpay order for the ₹1000 registration fee.
     * Validates that the student's current status is NOT_PAID.
     */
    public RazorpayOrderResponse createRegistrationOrder(String email) {
        StudentInternship si = getStudentInternship(email);

        if (si.getPaymentStatus() != PaymentStatus.NOT_PAID) {
            throw new IllegalStateException("Registration fee already paid");
        }

        return createRazorpayOrder(REGISTRATION_FEE_PAISE);
    }

    /**
     * Creates a Razorpay order for the remaining balance.
     * Validates that the student's current status is PARTIAL.
     */
    public RazorpayOrderResponse createRemainingOrder(String email) {
        StudentInternship si = getStudentInternship(email);

        if (si.getPaymentStatus() != PaymentStatus.PARTIAL) {
            throw new IllegalStateException("No remaining balance to pay");
        }

        long amountPaise = si.getRemainingAmount()
                .multiply(new BigDecimal("100"))
                .longValue();

        return createRazorpayOrder(amountPaise);
    }

    /**
     * Verifies the Razorpay signature and, on success, updates the StudentInternship
     * amounts and status, then triggers receipt generation.
     */
    public PaymentVerifyResponse verifyAndRecord(PaymentVerifyRequest request, String email) {
        // HMAC-SHA256 signature verification
        String expectedSignature = computeHmacSha256(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpayKeySecret
        );

        if (!expectedSignature.equals(request.getRazorpaySignature())) {
            throw new PaymentVerificationException("Payment verification failed");
        }

        StudentInternship si = getStudentInternship(email);
        String paymentType = request.getPaymentType();

        if ("REGISTRATION".equalsIgnoreCase(paymentType)) {
            applyRegistrationPayment(si, request.getRazorpayPaymentId());
        } else if ("REMAINING".equalsIgnoreCase(paymentType)) {
            applyRemainingPayment(si, request.getRazorpayPaymentId());
        } else {
            throw new IllegalArgumentException("Unknown paymentType: " + paymentType);
        }

        studentInternshipRepository.save(si);

        // Generate receipt asynchronously-safe: si already has updated amounts
        try {
            receiptService.generateReceipt(si.getStudent(), si, paymentType, request.getRazorpayPaymentId());
        } catch (Exception e) {
            logger.warn("Receipt generation failed for student {} paymentType {}: {}",
                    email, paymentType, e.getMessage());
        }

        return new PaymentVerifyResponse(true, si.getPaymentStatus());
    }

    // --- private helpers ---

    private StudentInternship getStudentInternship(String email) {
        return studentInternshipRepository.findByStudentEmail(email)
                .orElseThrow(() -> new StudentInternshipNotFoundException("No internship plan assigned"));
    }

    private RazorpayOrderResponse createRazorpayOrder(long amountPaise) {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("payment_capture", 1);

            Order order = client.orders.create(orderRequest);
            return new RazorpayOrderResponse(
                    order.get("id"),
                    amountPaise,
                    "INR",
                    razorpayKeyId
            );
        } catch (RazorpayException e) {
            logger.error("Razorpay order creation failed: {}", e.getMessage());
            throw new RuntimeException("Payment gateway error");
        }
    }

    private void applyRegistrationPayment(StudentInternship si, String paymentId) {
        BigDecimal newPaid = si.getPaidAmount().add(REGISTRATION_FEE);
        if (newPaid.compareTo(si.getTotalFee()) > 0) {
            throw new OverpaymentException("Payment exceeds total fee");
        }
        si.setPaidAmount(newPaid);
        si.setRemainingAmount(si.getTotalFee().subtract(newPaid));
        si.setPaymentStatus(PaymentStatus.PARTIAL);
        si.setRazorpayRegistrationPaymentId(paymentId);
    }

    private void applyRemainingPayment(StudentInternship si, String paymentId) {
        BigDecimal newPaid = si.getTotalFee(); // paying the full remaining balance
        if (newPaid.compareTo(si.getTotalFee()) > 0) {
            throw new OverpaymentException("Payment exceeds total fee");
        }
        si.setPaidAmount(newPaid);
        si.setRemainingAmount(BigDecimal.ZERO);
        si.setPaymentStatus(PaymentStatus.FULL);
        si.setRazorpayRemainingPaymentId(paymentId);
    }

    private String computeHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("HMAC computation failed", e);
        }
    }
}
