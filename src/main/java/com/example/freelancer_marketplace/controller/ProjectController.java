package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @GetMapping("/user/{userId}")
    public List<Project> getProjectsByUserId(@PathVariable Long userId) {
        return projectRepository.findByUserId(userId);
    }

    @GetMapping("/status/{status}")
    public List<Project> getProjectsByStatus(@PathVariable String status) {
        return projectRepository.findByStatus(status);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }
    @DeleteMapping("/{projectId}")
public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
    // Check if the project exists
    if (!projectRepository.existsById(projectId)) {
        return ResponseEntity.notFound().build();
    }

    // Delete the project
    projectRepository.deleteById(projectId);

    return ResponseEntity.ok().build();
}

}
