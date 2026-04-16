package com.zelixa.zelixa.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class WahaService {

    @Value("${app.waha.base-url:http://localhost:3001}")
    private String baseUrl;

    @Value("${app.waha.session:default}")
    private String session;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Send a text message via WhatsApp
     */
    public boolean sendText(String phoneNumber, String message) {
        try {
            String cleanNumber = phoneNumber.replaceAll("[^0-9]", "");
            if (!cleanNumber.endsWith("@c.us")) {
                cleanNumber = cleanNumber + "@c.us";
            }

            // WAHA v2 API endpoint
            String url = baseUrl + "/api/sendText";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("chatId", cleanNumber);
            payload.put("text", message);
            payload.put("session", session);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(url, request, String.class);
            log.info("Sent WhatsApp message to {}", phoneNumber);
            return true;
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }

    /**
     * Get WAHA session status
     */
    public String getStatus() {
        try {
            // WAHA v2: GET /api/sessions/{session}
            String url = baseUrl + "/api/sessions/" + session;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("status")) {
                return response.get("status").toString();
            }
            return "UNKNOWN";
        } catch (HttpClientErrorException.NotFound e) {
            // Session belum dibuat
            return "STOPPED";
        } catch (Exception e) {
            log.error("Failed to get WAHA status: {}", e.getMessage());
            return "DISCONNECTED";
        }
    }

    /**
     * Get QR code for WhatsApp pairing
     */
    public byte[] getQrCode() {
        try {
            // WAHA v2: GET /api/{session}/auth/qr
            String url = baseUrl + "/api/" + session + "/auth/qr";
            return restTemplate.getForObject(url, byte[].class);
        } catch (Exception e) {
            log.error("Failed to get WAHA QR code: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Start/Create a WAHA session.
     * WAHA v2 API: POST /api/sessions — creates session if not exists.
     * WAHA v1 API: POST /api/sessions/start
     * Tries v2 first, falls back to v1.
     */
    public boolean startSession() {
        // Try WAHA v2 API first: POST /api/sessions
        try {
            String urlV2 = baseUrl + "/api/sessions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("name", session);
            payload.put("config", new HashMap<>());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(urlV2, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("WAHA session '{}' created via v2 API", session);
                return true;
            }
        } catch (HttpClientErrorException.Conflict e) {
            // 409 = Session sudah ada, itu OK
            log.info("WAHA session '{}' already exists", session);
            return true;
        } catch (Exception e) {
            log.warn("WAHA v2 start failed, trying v1: {}", e.getMessage());
        }

        // Fallback to WAHA v1: POST /api/sessions/start
        try {
            String urlV1 = baseUrl + "/api/sessions/start";
            Map<String, String> payload = new HashMap<>();
            payload.put("name", session);
            restTemplate.postForEntity(urlV1, payload, String.class);
            log.info("WAHA session '{}' started via v1 API", session);
            return true;
        } catch (HttpClientErrorException.Conflict e) {
            log.info("WAHA session '{}' already active (v1)", session);
            return true;
        } catch (Exception e) {
            log.error("Failed to start WAHA session '{}': {}", session, e.getMessage());
            return false;
        }
    }

    /**
     * Stop/Logout a WAHA session
     */
    public boolean logoutSession() {
        try {
            // WAHA v2: DELETE /api/sessions/{session}
            String url = baseUrl + "/api/sessions/" + session;
            restTemplate.delete(url);
            log.info("WAHA session '{}' deleted", session);
            return true;
        } catch (Exception e) {
            // Fallback v1
            try {
                String urlV1 = baseUrl + "/api/sessions/logout";
                Map<String, String> payload = new HashMap<>();
                payload.put("name", session);
                restTemplate.postForEntity(urlV1, payload, String.class);
                return true;
            } catch (Exception ex) {
                log.error("Failed to logout WAHA session: {}", ex.getMessage());
                return false;
            }
        }
    }
}
