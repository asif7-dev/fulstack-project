package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_item_modifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemModification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String modificationID;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private String modificationName;

    @Builder.Default
    @Column(nullable = false)
    private Double additionalCost = 0.0;
}
