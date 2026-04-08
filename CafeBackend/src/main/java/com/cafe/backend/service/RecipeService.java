package com.cafe.backend.service;

import com.cafe.backend.dto.RecipeIngredientRequest;
import com.cafe.backend.dto.RecipeIngredientResponse;
import com.cafe.backend.dto.RecipeRequest;
import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.InventoryItem;
import com.cafe.backend.model.MenuItem;
import com.cafe.backend.model.RecipeIngredient;
import com.cafe.backend.repository.InventoryItemRepository;
import com.cafe.backend.repository.MenuItemRepository;
import com.cafe.backend.repository.RecipeIngredientRepository;
import com.cafe.backend.util.UnitConversionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeIngredientRepository recipeIngredientRepository;
    private final MenuItemRepository menuItemRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public List<RecipeIngredientResponse> getRecipeByMenuItemId(String menuItemId) {
        return recipeIngredientRepository.findByMenuItem_MenuItemID(menuItemId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<RecipeIngredientResponse> replaceRecipeByMenuItemId(String menuItemId, List<RecipeIngredientRequest> ingredients) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + menuItemId));

        recipeIngredientRepository.deleteByMenuItem_MenuItemID(menuItemId);

        List<RecipeIngredient> recipeIngredients = new ArrayList<>();
        if (ingredients == null || ingredients.isEmpty()) {
            return List.of();
        }

        for (RecipeIngredientRequest request : ingredients) {
            if (request.getInventoryItemID() == null || request.getIngredientQuantity() == null || request.getIngredientQuantity() <= 0) {
                continue;
            }

            InventoryItem inventoryItem = inventoryItemRepository.findById(request.getInventoryItemID())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryItem not found with id: " + request.getInventoryItemID()));

            RecipeIngredient recipeIngredient = RecipeIngredient.builder()
                    .menuItem(menuItem)
                    .inventoryItem(inventoryItem)
                    .ingredientQuantity(request.getIngredientQuantity())
                    .build();

            recipeIngredients.add(recipeIngredient);
        }

        return recipeIngredientRepository.saveAll(recipeIngredients).stream().map(this::toResponse).toList();
    }

    @Transactional
    public List<RecipeIngredientResponse> createOrReplaceRecipe(RecipeRequest request) {
        if (request == null || request.getMenuItemID() == null || request.getMenuItemID().isBlank()) {
            throw new ResourceNotFoundException("menuItemID is required");
        }
        return replaceRecipeByMenuItemId(request.getMenuItemID(), request.getIngredients());
    }

    private RecipeIngredientResponse toResponse(RecipeIngredient recipeIngredient) {
        return RecipeIngredientResponse.builder()
                .recipeID(recipeIngredient.getRecipeID())
                .menuItemID(recipeIngredient.getMenuItem().getMenuItemID())
                .menuItemName(recipeIngredient.getMenuItem().getName())
                .inventoryItemID(recipeIngredient.getInventoryItem().getInventoryItemID())
                .inventoryItemName(recipeIngredient.getInventoryItem().getName())
                .quantityRequired(recipeIngredient.getIngredientQuantity())
                .baseUnit(UnitConversionUtil.baseUnitFor(recipeIngredient.getInventoryItem().getUnit()))
                .build();
    }
}
