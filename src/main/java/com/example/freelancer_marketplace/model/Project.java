package com.example.freelancer_marketplace.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String status; // "OPEN", "IN_PROGRESS", "COMPLETED"

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Bid> bids = new HashSet<>();
}
