package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reportID;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Double totalSales;

    @Column(nullable = false)
    private Integer totalTransactions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
