package com.cafe.backend.repository;

import com.cafe.backend.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    Optional<InventoryItem> findFirstByNameIgnoreCase(String name);
}
