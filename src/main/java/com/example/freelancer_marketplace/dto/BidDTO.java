package com.example.freelancer_marketplace.dto;

import lombok.Data;

@Data
public class BidDTO {
    private Long id;
    private Double amount;
    private String proposal;
    private ProjectDTO project;
}
