package com.cafe.backend.service;

import com.cafe.backend.dto.InventoryItemRequest;
import com.cafe.backend.dto.InventoryItemResponse;
import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.InventoryItem;
import com.cafe.backend.repository.InventoryItemRepository;
import com.cafe.backend.util.UnitConversionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;

    public List<InventoryItemResponse> getAllInventoryItems() {
        return inventoryItemRepository.findAll().stream().map(this::toResponse).toList();
    }

    public InventoryItemResponse getInventoryItemById(String id) {
        return toResponse(getInventoryEntityById(id));
    }

    public InventoryItem getInventoryEntityById(String id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem not found with id: " + id));
    }

    public InventoryItemResponse createInventoryItem(InventoryItemRequest item) {
        String displayUnit = normalizeUnit(item.getUnit());
        InventoryItem entity = InventoryItem.builder()
                .name(item.getName())
                .unit(displayUnit)
                .quantity(UnitConversionUtil.toBaseUnit(valueOrZero(item.getQuantity()), displayUnit))
                .reorderLevel(UnitConversionUtil.toBaseUnit(valueOrZero(item.getReorderLevel()), displayUnit))
                .build();
        return toResponse(inventoryItemRepository.save(entity));
    }

    public InventoryItemResponse updateInventoryItem(String id, InventoryItemRequest itemDetails) {
        InventoryItem item = getInventoryEntityById(id);
        String displayUnit = normalizeUnit(itemDetails.getUnit() == null ? item.getUnit() : itemDetails.getUnit());
        item.setName(itemDetails.getName());
        item.setUnit(displayUnit);
        item.setQuantity(UnitConversionUtil.toBaseUnit(valueOrZero(itemDetails.getQuantity()), displayUnit));
        item.setReorderLevel(UnitConversionUtil.toBaseUnit(valueOrZero(itemDetails.getReorderLevel()), displayUnit));
        return toResponse(inventoryItemRepository.save(item));
    }

    public void deductStock(String id, Double quantity) {
        InventoryItem item = getInventoryEntityById(id);
        item.setQuantity(item.getQuantity() - valueOrZero(quantity));
        inventoryItemRepository.save(item);
    }

    public void deleteInventoryItem(String id) {
        InventoryItem item = getInventoryEntityById(id);
        inventoryItemRepository.delete(item);
    }

    private InventoryItemResponse toResponse(InventoryItem entity) {
        String unit = normalizeUnit(entity.getUnit());
        double displayQuantity = UnitConversionUtil.fromBaseUnit(valueOrZero(entity.getQuantity()), unit);
        double displayReorder = UnitConversionUtil.fromBaseUnit(valueOrZero(entity.getReorderLevel()), unit);
        return InventoryItemResponse.builder()
                .inventoryItemID(entity.getInventoryItemID())
                .name(entity.getName())
                .quantity(displayQuantity)
                .reorderLevel(displayReorder)
                .unit(unit)
                .baseUnit(UnitConversionUtil.baseUnitFor(unit))
                .status(resolveStatus(valueOrZero(entity.getQuantity()), valueOrZero(entity.getReorderLevel())))
                .build();
    }

    private String resolveStatus(double baseQuantity, double baseReorderLevel) {
        if (baseQuantity <= 0) {
            return "OUT OF STOCK";
        }
        if (baseQuantity <= baseReorderLevel) {
            return "LOW";
        }
        return "OK";
    }

    private String normalizeUnit(String unit) {
        String normalized = unit == null ? "gram" : unit.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "g", "gram", "grams" -> "gram";
            case "kg", "kilogram", "kilograms" -> "kg";
            case "ml", "milliliter", "millilitre", "milliliters", "millilitres" -> "ml";
            case "l", "liter", "litre", "liters", "litres" -> "litre";
            default -> normalized;
        };
    }

    private double valueOrZero(Double value) {
        return value == null ? 0.0 : value;
    }
}
