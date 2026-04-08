package com.cafe.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryItemResponse {
    private String inventoryItemID;
    private String name;
    private Double quantity;
    private Double reorderLevel;
    private String unit;
    private String baseUnit;
    private String status;
}
