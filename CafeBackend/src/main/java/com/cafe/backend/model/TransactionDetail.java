package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "transaction_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionDetailID;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    private String menuItemID;

    private Integer quantity;

    private Double price;
}
