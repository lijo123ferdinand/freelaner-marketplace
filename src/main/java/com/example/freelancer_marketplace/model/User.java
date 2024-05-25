package com.example.freelancer_marketplace.model;



import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
@Data
@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role; // "CLIENT" or "FREELANCER"

    // Getters and Setters
    // Other fields and methods

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Project> projects = new HashSet<>();
}
