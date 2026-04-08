package com.cafe.backend.service;

import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.MenuItem;
import com.cafe.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));
    }

    public List<MenuItem> getMenuItemsByCategory(String categoryId) {
        return menuItemRepository.findByCategory_CategoryID(categoryId);
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(String id, MenuItem menuItemDetails) {
        MenuItem menuItem = getMenuItemById(id);
        menuItem.setName(menuItemDetails.getName());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setImageUrl(menuItemDetails.getImageUrl());
        menuItem.setIsAvailable(menuItemDetails.getIsAvailable());
        menuItem.setCategory(menuItemDetails.getCategory());
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(String id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }
}
