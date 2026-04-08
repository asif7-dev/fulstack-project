package com.cafe.backend.controller;

import com.cafe.backend.model.MenuItem;
import com.cafe.backend.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
@Tag(name = "Menu Management", description = "Endpoints for managing cafe menu items")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping
    @Operation(summary = "Get all menu items")
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID")
    public MenuItem getMenuItemById(@PathVariable String id) {
        return menuItemService.getMenuItemById(id);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get menu items by category")
    public List<MenuItem> getMenuItemsByCategory(@PathVariable String categoryId) {
        return menuItemService.getMenuItemsByCategory(categoryId);
    }

    @PostMapping
    @Operation(summary = "Create a new menu item")
    public MenuItem createMenuItem(@RequestBody MenuItem menuItem) {
        return menuItemService.createMenuItem(menuItem);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing menu item")
    public MenuItem updateMenuItem(@PathVariable String id, @RequestBody MenuItem menuItem) {
        return menuItemService.updateMenuItem(id, menuItem);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a menu item")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable String id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
