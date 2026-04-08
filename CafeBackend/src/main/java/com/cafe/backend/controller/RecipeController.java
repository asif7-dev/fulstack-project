package com.cafe.backend.controller;

import com.cafe.backend.dto.RecipeIngredientRequest;
import com.cafe.backend.dto.RecipeIngredientResponse;
import com.cafe.backend.dto.RecipeRequest;
import com.cafe.backend.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Tag(name = "Recipe Management", description = "Configure ingredient usage per menu item")
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/menu/{menuItemId}")
    @Operation(summary = "Get recipe ingredients by menu item")
    public List<RecipeIngredientResponse> getRecipeByMenuItem(@PathVariable String menuItemId) {
        return recipeService.getRecipeByMenuItemId(menuItemId);
    }

    @GetMapping("/menu-item/{menuItemId}")
    @Operation(summary = "Get recipe ingredients by menu item (legacy path)")
    public List<RecipeIngredientResponse> getRecipeByMenuItemLegacy(@PathVariable String menuItemId) {
        return recipeService.getRecipeByMenuItemId(menuItemId);
    }

    @PostMapping
    @Operation(summary = "Create or replace recipe for a menu item")
    public List<RecipeIngredientResponse> createRecipe(@RequestBody RecipeRequest request) {
        return recipeService.createOrReplaceRecipe(request);
    }

    @PutMapping("/menu-item/{menuItemId}")
    @Operation(summary = "Replace recipe ingredients for a menu item")
    public List<RecipeIngredientResponse> replaceRecipeByMenuItem(
            @PathVariable String menuItemId,
            @RequestBody List<RecipeIngredientRequest> ingredients) {
        return recipeService.replaceRecipeByMenuItemId(menuItemId, ingredients);
    }
}
