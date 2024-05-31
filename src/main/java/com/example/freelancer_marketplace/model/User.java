package com.example.freelancer_marketplace.model;

import lombok.Data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String username;

    private String password;

    @NotBlank(message = "Role is mandatory")
    private String role; // "CLIENT" or "FREELANCER"

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email; // Add email field

}