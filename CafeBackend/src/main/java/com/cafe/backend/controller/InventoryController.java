package com.cafe.backend.controller;

import com.cafe.backend.dto.InventoryItemRequest;
import com.cafe.backend.dto.InventoryItemResponse;
import com.cafe.backend.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory Management", description = "Endpoints for managing stock levels")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get all inventory items")
    public List<InventoryItemResponse> getAllInventoryItems() {
        return inventoryService.getAllInventoryItems();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID")
    public InventoryItemResponse getInventoryItemById(@PathVariable String id) {
        return inventoryService.getInventoryItemById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new inventory item")
    public InventoryItemResponse createInventoryItem(@RequestBody InventoryItemRequest item) {
        return inventoryService.createInventoryItem(item);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing inventory item")
    public InventoryItemResponse updateInventoryItem(@PathVariable String id, @RequestBody InventoryItemRequest item) {
        return inventoryService.updateInventoryItem(id, item);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inventory item")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable String id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.noContent().build();
    }
}
