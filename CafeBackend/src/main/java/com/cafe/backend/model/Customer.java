package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String customerID;

    @Column(nullable = false)
    private String name;

    private String contactInfo;

    private Integer loyaltyPoints = 0;
}
