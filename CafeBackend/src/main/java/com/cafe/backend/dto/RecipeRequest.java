package com.cafe.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecipeRequest {
    private String menuItemID;
    private List<RecipeIngredientRequest> ingredients;
}
