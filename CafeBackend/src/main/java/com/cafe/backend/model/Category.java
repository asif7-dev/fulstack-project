package com.cafe.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String categoryID;

    @Column(nullable = false, unique = true)
    private String categoryName;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems;
}
