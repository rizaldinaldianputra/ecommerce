package com.zelixa.zelixa.service;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ShippingService {

    @Value("${app.rajaongkir.api-key}")
    private String apiKey;

    // Base URL should ideally be https://rajaongkir.komerce.id/api/v1
    @Value("${app.rajaongkir.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private String getApiBaseUrl() {
        // If baseUrl is the specific cost endpoint, extract the base v1 part
        if (baseUrl.contains("/calculate/")) {
            return baseUrl.substring(0, baseUrl.indexOf("/calculate"));
        }
        return baseUrl;
    }

    public List<Object> getProvinces() {
        return fetchFromKomerce("/destination/province");
    }

    public List<Object> getCities(String provinceId) {
        return fetchFromKomerce("/destination/city/" + provinceId);
    }

    public List<Object> getDistricts(String cityId) {
        return fetchFromKomerce("/destination/district/" + cityId);
    }

    public List<Object> getSubdistricts(String districtId) {
        return fetchFromKomerce("/destination/sub-district/" + districtId);
    }

    public List<com.zelixa.zelixa.dto.ShippingCourierResponse> calculateCost(String origin, String destination, int weight, String courier) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Key", apiKey);
            headers.set("Content-Type", "application/x-www-form-urlencoded");

            String body = "origin=" + origin +
                    "&destination=" + destination +
                    "&weight=" + weight +
                    "&courier=" + courier +
                    "&price=lowest";

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            String costUrl = getApiBaseUrl() + "/calculate/district/domestic-cost";
            
            ResponseEntity<String> response = restTemplate.postForEntity(costUrl, entity, String.class);
            JSONObject jsonResponse = new JSONObject(response.getBody());
            
            List<com.zelixa.zelixa.dto.ShippingCourierResponse> result = new ArrayList<>();
            if (jsonResponse.has("data")) {
                JSONArray data = jsonResponse.getJSONArray("data");
                for (int i = 0; i < data.length(); i++) {
                    JSONObject obj = data.getJSONObject(i);
                    result.add(com.zelixa.zelixa.dto.ShippingCourierResponse.builder()
                            .code(obj.optString("code"))
                            .name(obj.optString("name"))
                            .service(obj.optString("service"))
                            .description(obj.optString("description"))
                            .cost(obj.optDouble("cost", 0.0))
                            .etd(obj.optString("etd"))
                            .build());
                }
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to calculate shipping cost from {} to {}: {}", origin, destination, e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Object> fetchFromKomerce(String endpoint) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Key", apiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = getApiBaseUrl() + endpoint;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JSONObject jsonResponse = new JSONObject(response.getBody());
            
            if (jsonResponse.has("data")) {
                Object data = jsonResponse.get("data");
                if (data instanceof JSONArray) {
                    return ((JSONArray) data).toList();
                } else if (data instanceof JSONObject) {
                    List<Object> list = new ArrayList<>();
                    list.add(((JSONObject) data).toMap());
                    return list;
                }
            }
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Failed to fetch from Komerce {}: {}", endpoint, e.getMessage());
            return new ArrayList<>();
        }
    }
}
