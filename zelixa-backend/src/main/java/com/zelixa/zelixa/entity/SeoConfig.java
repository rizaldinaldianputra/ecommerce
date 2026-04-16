package com.zelixa.zelixa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seo_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeoConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_name", unique = true, nullable = false, length = 50)
    private String pageName; // e.g., GLOBAL, HOME, PRODUCT_LIST, etc.

    @Column(name = "script_code", columnDefinition = "TEXT")
    private String scriptCode;
}
