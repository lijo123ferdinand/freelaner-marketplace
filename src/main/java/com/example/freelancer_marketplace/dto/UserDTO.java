package com.example.freelancer_marketplace.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String role;
    private String email;
    // Other fields as needed
}
