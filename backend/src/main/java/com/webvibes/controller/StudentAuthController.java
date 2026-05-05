package com.webvibes.controller;

import com.webvibes.dto.ForgotPasswordRequest;
import com.webvibes.dto.MessageResponse;
import com.webvibes.dto.ResetPasswordRequest;
import com.webvibes.dto.StudentAuthResponse;
import com.webvibes.dto.StudentLoginRequest;
import com.webvibes.dto.StudentRegisterRequest;
import com.webvibes.dto.VerifyOtpRequest;
import com.webvibes.security.JwtTokenProvider;
import com.webvibes.service.EmailService;
import com.webvibes.service.OtpService;
import com.webvibes.service.StudentService;
import com.webvibes.entity.Student;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/auth")
public class StudentAuthController {

    private static final Logger log = LoggerFactory.getLogger(StudentAuthController.class);

    @Autowired
    private StudentService studentService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody StudentRegisterRequest request) {
        studentService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Student registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody StudentLoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.generateToken(authentication);

            String role = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ROLE_STUDENT");

            // Resolve student name from principal (email) via StudentService
            String name = studentService.findByEmail(authentication.getName())
                    .map(s -> s.getName())
                    .orElse(authentication.getName());

            return ResponseEntity.ok(new StudentAuthResponse(token, name, role));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid email or password"));
        } catch (Exception e) {
            log.error("Student login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Login failed: " + e.getMessage()));
        }
    }

    /**
     * Step 1: Student requests OTP — POST /api/student/auth/forgot-password
     * Sends a 6-digit OTP to the student's registered email.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Student student = studentService.findByEmail(request.getEmail()).orElse(null);
        // Always return success to prevent email enumeration
        if (student == null) {
            return ResponseEntity.ok(new MessageResponse("If this email is registered, an OTP has been sent."));
        }
        try {
            String otp = otpService.generateOtp(request.getEmail());
            emailService.sendOtpEmail(request.getEmail(), otp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("OTP sent to your registered email. Valid for 10 minutes."));
    }

    /**
     * Step 2: Student verifies OTP and sets new password — POST /api/student/auth/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Invalid or expired OTP. Please request a new one."));
        }
        Student student = studentService.findByEmail(request.getEmail()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Student not found."));
        }
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentService.save(student);
        log.info("Password reset via OTP for student: {}", request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Password reset successfully. You can now log in."));
    }

    /**
     * Admin-only: reset a student's password — POST /api/student/auth/reset-password
     */
    @PostMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Student student = studentService.findByEmail(request.getEmail()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No student found with email: " + request.getEmail()));
        }
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentService.save(student);
        log.info("Admin reset password for student: {}", request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Password reset successfully for " + student.getName()));
    }
}
