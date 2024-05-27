package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.dto.ProjectDTO;
import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.User;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import com.example.freelancer_marketplace.repos.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;

   
    public Project createProject(Project project, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            project.setUser(userOptional.get());
            return projectRepository.save(project);
        } else {
            throw new IllegalArgumentException("No such user found");
        }
    }



    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> findProjectsByStatus(String status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Method to convert a single Project entity to ProjectDTO
    public ProjectDTO convertToDTO(Project project) {
        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getStatus()
        );
    }

    // Method to convert a list of Project entities to a list of ProjectDTOs
    public List<ProjectDTO> convertToDTOs(List<Project> projects) {
        return projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
