package com.cafe.backend.config;

import com.cafe.backend.model.*;
import com.cafe.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final CustomerRepository customerRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0)
            return;

        // 1. Seed Categories
        Category coffee = Category.builder().categoryName("Coffee").build();
        Category tea = Category.builder().categoryName("Tea").build();
        Category pastries = Category.builder().categoryName("Pastries").build();
        Category sandwiches = Category.builder().categoryName("Sandwiches").build();
        categoryRepository.saveAll(Arrays.asList(coffee, tea, pastries, sandwiches));

        // 2. Seed Menu Items
        MenuItem espresso = MenuItem.builder()
                .name("Espresso")
                .description("Strong black coffee")
                .price(2.50)
                .isAvailable(true)
                .category(coffee)
                .imageUrl("assets/images/espresso_coffee_1768937965452.png")
                .build();

        MenuItem latte = MenuItem.builder()
                .name("Latte")
                .description("Coffee with milk foam")
                .price(3.50)
                .isAvailable(true)
                .category(coffee)
                .imageUrl("assets/images/latte_real.jpg")
                .build();

        menuItemRepository.saveAll(Arrays.asList(espresso, latte));

        // 3. Seed Inventory
        InventoryItem beans = InventoryItem.builder()
                .name("Coffee Beans")
                .quantity(50.0)
                .reorderLevel(10.0)
                .unit("kg")
                .build();
        inventoryItemRepository.save(beans);

        // 4. Seed Customers
        Customer walkIn = Customer.builder()
                .name("Walk-in Customer")
                .contactInfo("N/A")
                .loyaltyPoints(0)
                .build();
        customerRepository.save(walkIn);
    }
}
