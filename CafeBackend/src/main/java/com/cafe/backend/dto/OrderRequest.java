package com.cafe.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private String userID;
    private String customerID;
    private List<OrderItemRequest> items;
}
