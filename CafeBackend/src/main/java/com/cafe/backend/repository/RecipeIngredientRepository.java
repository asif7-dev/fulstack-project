package com.cafe.backend.repository;

import com.cafe.backend.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, String> {
    List<RecipeIngredient> findByMenuItem_MenuItemID(String menuItemID);

    @Modifying
    @Transactional
    void deleteByMenuItem_MenuItemID(String menuItemID);

    @Modifying
    @Transactional
    void deleteByInventoryItem_InventoryItemID(String inventoryItemID);
}
