package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private String label;
    private String recipientName;
    private String phoneNumber;
    private String provinceId;
    private String provinceName;
    private String cityId;
    private String cityName;
    private String districtId;
    private String districtName;
    private String subdistrictId;
    private String subdistrictName;
    private String addressLine;
    private String postalCode;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
