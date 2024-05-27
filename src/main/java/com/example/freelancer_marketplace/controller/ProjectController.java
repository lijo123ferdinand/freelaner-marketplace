package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.dto.ProjectDTO;
import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.User;
import com.example.freelancer_marketplace.service.ProjectService;
import com.example.freelancer_marketplace.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
       @Autowired
    private UserService userService;

    

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        List<ProjectDTO> projectDTOs = projectService.convertToDTOs(projects);
        return ResponseEntity.ok(projectDTOs);
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        List<Project> projects = projectService.findProjectsByStatus(status);
        return ResponseEntity.ok(projects);
    }
   
    @PostMapping("/{userId}")
    public ResponseEntity<?> createProject(@Valid @RequestBody Project project, @PathVariable Long userId) {
        try {
            Project createdProject = projectService.createProject(project, userId);
            ProjectDTO projectDTO = projectService.convertToDTO(createdProject);
            return ResponseEntity.ok(projectDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
