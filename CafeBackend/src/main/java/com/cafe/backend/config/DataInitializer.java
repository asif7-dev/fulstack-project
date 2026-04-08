package com.cafe.backend.config;

import com.cafe.backend.model.Category;
import com.cafe.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding default categories...");
            categoryRepository.saveAll(Arrays.asList(
                    Category.builder().categoryName("Coffee").build(),
                    Category.builder().categoryName("Tea").build(),
                    Category.builder().categoryName("Pastries").build(),
                    Category.builder().categoryName("Sandwiches").build()
            ));
            System.out.println("Default categories seeded.");
        }
    }
}
