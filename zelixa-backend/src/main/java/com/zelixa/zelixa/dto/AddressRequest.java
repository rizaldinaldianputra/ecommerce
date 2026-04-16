package com.zelixa.zelixa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
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
}
