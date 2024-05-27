package com.example.freelancer_marketplace.dto;

import lombok.Data;

@Data
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String status;

    public ProjectDTO(Long id, String title, String description, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}
