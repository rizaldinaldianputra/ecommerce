package com.zelixa.zelixa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WahaService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.waha.url:http://localhost:3000}")
    private String wahaUrl;

    @Value("${app.waha.session:default}")
    private String session;

    @Value("${app.waha.api-key:}")
    private String apiKey;

    /**
     * Sends a text message via WAHA API.
     * @param phoneNumber Recipient number in international format (e.g. 628...)
     * @param message Text message content
     */
    public void sendText(String phoneNumber, String message) {
        try {
            String url = String.format("%s/api/sendText", wahaUrl);

            Map<String, Object> body = new HashMap<>();
            body.put("chatId", phoneNumber + "@c.us");
            body.put("text", message);
            body.put("session", session);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (apiKey != null && !apiKey.isEmpty()) {
                headers.set("X-Api-Key", apiKey);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(url, request, String.class);
            log.info("Successfully sent WhatsApp message via WAHA to {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message via WAHA to {}: {}", phoneNumber, e.getMessage());
        }
    }
}
