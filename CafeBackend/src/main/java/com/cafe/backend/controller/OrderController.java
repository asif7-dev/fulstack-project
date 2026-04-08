package com.cafe.backend.controller;

import com.cafe.backend.dto.OrderRequest;
import com.cafe.backend.dto.OrderResponse;
import com.cafe.backend.model.Transaction;
import com.cafe.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Processing (POS)", description = "Endpoints for creating and viewing transactions")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order and deduct recipe ingredients")
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }

    @GetMapping
    @Operation(summary = "Get all transaction history")
    public List<Transaction> getAllTransactions() {
        return orderService.getAllTransactions();
    }
}
