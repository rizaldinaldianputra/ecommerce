package com.zelixa.zelixa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private final WahaService wahaService;

    private static final String OTP_PREFIX = "OTP:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateOtp(String phoneNumber) {
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // Normalize phone number (convert 08... to 628...)
        String normalizedPhone = phoneNumber.replaceAll("[^0-9]", "");
        if (normalizedPhone.startsWith("0")) {
            normalizedPhone = "62" + normalizedPhone.substring(1);
        } else if (!normalizedPhone.startsWith("62")) {
            normalizedPhone = "62" + normalizedPhone; // Fallback to 62 if no country code
        }
        
        // Store in Redis with TTL using original phoneNumber (or normalized, but consistency is key)
        redisTemplate.opsForValue().set(OTP_PREFIX + phoneNumber, code, Duration.ofMinutes(OTP_EXPIRY_MINUTES));
        
        String message = "*Zelixa Authentication*\n\nYour verification code is: *" + code + "*\nValid for " + OTP_EXPIRY_MINUTES + " minutes.\n\nPlease do not share this code with anyone.";
        wahaService.sendText(normalizedPhone, message);
        
        log.info("Generated OTP for {}: {}", phoneNumber, code);
        return code;
    }

    public boolean verifyOtp(String phoneNumber, String code) {
        String storedCode = redisTemplate.opsForValue().get(OTP_PREFIX + phoneNumber);
        
        if (storedCode != null && storedCode.equals(code)) {
            // Delete code after successful verification (one-time use)
            redisTemplate.delete(OTP_PREFIX + phoneNumber);
            return true;
        }
        
        return false;
    }
}
