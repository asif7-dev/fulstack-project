package com.cafe.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryItemRequest {
    private String name;
    private Double quantity;
    private Double reorderLevel;
    private String unit;
}
