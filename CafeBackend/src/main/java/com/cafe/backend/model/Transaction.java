package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionID;

    private String userID;

    private String customerID;

    private LocalDateTime date;

    private Double totalAmount;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<TransactionDetail> details;
}
