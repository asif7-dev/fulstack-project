package com.cafe.backend.service;

import com.cafe.backend.dto.OrderItemRequest;
import com.cafe.backend.dto.OrderItemResponse;
import com.cafe.backend.dto.OrderRequest;
import com.cafe.backend.dto.OrderResponse;
import com.cafe.backend.exception.InsufficientStockException;
import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.InventoryItem;
import com.cafe.backend.model.MenuItem;
import com.cafe.backend.model.RecipeIngredient;
import com.cafe.backend.model.Transaction;
import com.cafe.backend.model.TransactionDetail;
import com.cafe.backend.repository.InventoryItemRepository;
import com.cafe.backend.repository.MenuItemRepository;
import com.cafe.backend.repository.RecipeIngredientRepository;
import com.cafe.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final TransactionRepository transactionRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final MenuItemRepository menuItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        Map<String, Double> totalRequiredByInventoryId = new HashMap<>();
        List<OrderItemResponse> responseItems = new java.util.ArrayList<>();
        List<TransactionDetail> transactionDetails = new java.util.ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest.getMenuItemID() == null || itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Invalid order item payload");
            }

            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemID())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + itemRequest.getMenuItemID()));

            List<RecipeIngredient> ingredients = recipeIngredientRepository.findByMenuItem_MenuItemID(menuItem.getMenuItemID());
            if (ingredients.isEmpty()) {
                throw new RuntimeException("Recipe is not configured for menu item: " + menuItem.getName());
            }

            for (RecipeIngredient ingredient : ingredients) {
                double required = ingredient.getIngredientQuantity() * itemRequest.getQuantity();
                String inventoryId = ingredient.getInventoryItem().getInventoryItemID();
                totalRequiredByInventoryId.merge(inventoryId, required, Double::sum);
            }

            TransactionDetail detail = TransactionDetail.builder()
                    .menuItemID(menuItem.getMenuItemID())
                    .quantity(itemRequest.getQuantity())
                    .price(menuItem.getPrice())
                    .build();
            transactionDetails.add(detail);

            double lineTotal = menuItem.getPrice() * itemRequest.getQuantity();
            totalAmount += lineTotal;
            responseItems.add(OrderItemResponse.builder()
                    .menuItemID(menuItem.getMenuItemID())
                    .menuItemName(menuItem.getName())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .lineTotal(lineTotal)
                    .build());
        }

        validateStockAvailability(totalRequiredByInventoryId);

        totalRequiredByInventoryId.forEach(inventoryService::deductStock);

        Transaction transaction = Transaction.builder()
                .userID(request.getUserID())
                .customerID(request.getCustomerID())
                .date(LocalDateTime.now())
                .totalAmount(totalAmount)
                .details(transactionDetails)
                .build();

        transactionDetails.forEach(detail -> detail.setTransaction(transaction));
        Transaction saved = transactionRepository.save(transaction);

        return OrderResponse.builder()
                .orderID(saved.getTransactionID())
                .userID(saved.getUserID())
                .customerID(saved.getCustomerID())
                .date(saved.getDate())
                .totalAmount(saved.getTotalAmount())
                .items(responseItems)
                .build();
    }

    private void validateStockAvailability(Map<String, Double> requiredByInventoryItemId) {
        for (Map.Entry<String, Double> entry : requiredByInventoryItemId.entrySet()) {
            InventoryItem item = inventoryItemRepository.findById(entry.getKey())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryItem not found with id: " + entry.getKey()));
            if (item.getQuantity() < entry.getValue()) {
                throw new InsufficientStockException("Insufficient stock for " + item.getName());
            }
        }
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
