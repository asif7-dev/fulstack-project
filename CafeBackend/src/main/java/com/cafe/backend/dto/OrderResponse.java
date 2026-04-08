package com.cafe.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {
    private String orderID;
    private String userID;
    private String customerID;
    private LocalDateTime date;
    private Double totalAmount;
    private List<OrderItemResponse> items;
}
