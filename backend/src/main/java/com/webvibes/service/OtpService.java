package com.webvibes.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory OTP store with 10-minute expiry.
 * Each entry: email → {otp, expiresAt}
 */
@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_SECONDS = 600; // 10 minutes

    private final SecureRandom random = new SecureRandom();

    private record OtpEntry(String otp, Instant expiresAt) {}

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    /** Generate and store a 6-digit OTP for the given email. Returns the OTP. */
    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        store.put(email.toLowerCase(), new OtpEntry(otp, Instant.now().plusSeconds(OTP_EXPIRY_SECONDS)));
        return otp;
    }

    /** Returns true if the OTP matches and has not expired. Removes it on success. */
    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiresAt())) {
            store.remove(email.toLowerCase());
            return false;
        }
        if (!entry.otp().equals(otp)) return false;
        store.remove(email.toLowerCase()); // one-time use
        return true;
    }

    /** Invalidate any existing OTP for this email. */
    public void invalidate(String email) {
        store.remove(email.toLowerCase());
    }
}
