package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<Project> getProjectsByStatus(@PathVariable String status) {
        return projectRepository.findByStatus(status);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }
}
