package com.cafe.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeIngredientRequest {
    private String inventoryItemID;
    private Double ingredientQuantity;
}
