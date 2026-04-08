package com.cafe.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    private String menuItemID;
    private Integer quantity;
}
