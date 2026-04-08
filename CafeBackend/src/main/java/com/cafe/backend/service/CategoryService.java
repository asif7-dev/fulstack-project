package com.cafe.backend.service;

import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.Category;
import com.cafe.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category categoryDetails) {
        Category category = getCategoryById(id);
        category.setCategoryName(categoryDetails.getCategoryName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
