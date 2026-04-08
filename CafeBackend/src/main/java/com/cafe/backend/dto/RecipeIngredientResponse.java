package com.cafe.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecipeIngredientResponse {
    private String recipeID;
    private String menuItemID;
    private String menuItemName;
    private String inventoryItemID;
    private String inventoryItemName;
    private Double quantityRequired;
    private String baseUnit;
}
