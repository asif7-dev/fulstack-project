package com.cafe.backend.repository;

import com.cafe.backend.model.Restock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public interface RestockRepository extends JpaRepository<Restock, String> {
    @Modifying
    @Transactional
    void deleteByInventoryItem_InventoryItemID(String inventoryItemID);
}
