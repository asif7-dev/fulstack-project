package com.cafe.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {
    private String menuItemID;
    private String menuItemName;
    private Integer quantity;
    private Double unitPrice;
    private Double lineTotal;
}
