package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String recipeID;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;

    private Double ingredientQuantity;
}
