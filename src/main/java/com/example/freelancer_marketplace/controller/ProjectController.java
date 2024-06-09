package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.repos.BidRepository;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import com.example.freelancer_marketplace.service.BidService;
import com.example.freelancer_marketplace.service.ProjectService;
import com.example.freelancer_marketplace.service.TaskService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
   @Autowired
    private BidService bidService;

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private TaskService taskService;


    @Autowired
    private BidRepository bidRepository; // Assuming you have a BidRepository

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
    @Transactional
    public ResponseEntity<?> deleteProjectAndBids(@PathVariable Long projectId) {
        try {
            // Find the project by ID
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

            // Delete tasks associated with the project
            taskService.deleteTasksByProjectId(projectId);

            // Find all bids associated with the project
            List<Bid> bids = bidRepository.findByProjectId(projectId);

            // Delete each bid associated with the project
            for (Bid bid : bids) {
                bidRepository.delete(bid);
            }

            // Finally, delete the project
            projectRepository.delete(project);

            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the project and its bids.");
        }
    }

}