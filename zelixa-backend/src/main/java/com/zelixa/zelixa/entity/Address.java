package com.zelixa.zelixa.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(length = 50)
    private String label; // e.g. Home, Office

    @Column(name = "recipient_name", length = 100)
    private String recipientName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "province_id", length = 20)
    private String provinceId;

    @Column(name = "province_name", length = 100)
    private String provinceName;

    @Column(name = "city_id", length = 20)
    private String cityId;

    @Column(name = "city_name", length = 100)
    private String cityName;

    @Column(name = "district_id", length = 20)
    private String districtId;

    @Column(name = "district_name", length = 100)
    private String districtName;

    @Column(name = "subdistrict_id", length = 20)
    private String subdistrictId;

    @Column(name = "subdistrict_name", length = 100)
    private String subdistrictName;

    @Column(name = "address_line", length = 500)
    private String addressLine;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
