package com.cafe.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String inventoryItemID;

    @Column(nullable = false)
    private String name;

    private Double quantity;

    private Double reorderLevel;

    private String unit;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "inventoryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "inventoryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Restock> restocks = new ArrayList<>();
}
