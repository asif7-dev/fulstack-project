package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "restocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String restockID;

    @ManyToOne
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private LocalDateTime date;

    @PrePersist
    protected void onCreate() {
        if (date == null) {
            date = LocalDateTime.now();
        }
    }
}
