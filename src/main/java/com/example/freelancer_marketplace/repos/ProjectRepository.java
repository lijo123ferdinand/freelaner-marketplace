package com.example.freelancer_marketplace.repos;

import com.example.freelancer_marketplace.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(String status);

    List<Project> findByUserId(Long userId);
}
