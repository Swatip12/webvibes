package com.webvibes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Send a password-reset OTP email.
     * If mail is not configured (no MAIL_USERNAME env var), logs the OTP instead.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
            log.warn("Mail not configured. OTP for {} is: {}", toEmail, otp);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("WebVibes Technology — Password Reset OTP");
            message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your WebVibes Technology student account.\n\n" +
                "Your OTP is: " + otp + "\n\n" +
                "This OTP is valid for 10 minutes. Do not share it with anyone.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "— WebVibes Technology Team"
            );
            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send OTP email. Please try again.");
        }
    }
}
