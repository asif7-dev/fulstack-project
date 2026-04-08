package com.cafe.backend.repository;

import com.cafe.backend.model.MenuItemModification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemModificationRepository extends JpaRepository<MenuItemModification, String> {
    @Modifying
    @Transactional
    void deleteByMenuItem_MenuItemID(String menuItemID);
}
