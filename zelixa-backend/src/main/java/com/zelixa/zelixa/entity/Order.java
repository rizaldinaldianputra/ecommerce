package com.zelixa.zelixa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders") // "order" is a reserved keyword in SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, PAID, PROCESSING, DELIVERING, COMPLETED, CANCELLED, COMPLAINT,
                                       // RETURNED

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "complaint_notes", length = 500)
    private String complaintNotes;

    @Column(name = "payment_token", length = 255)
    private String paymentToken;

    @Column(name = "payment_url", length = 500)
    private String paymentUrl;

    @Column(name = "shipping_amount")
    private Double shippingAmount;

    @Column(name = "shipping_service", length = 100)
    private String shippingService;

    @Column(name = "destination_subdistrict_id", length = 20)
    private String destinationSubdistrictId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;
}
