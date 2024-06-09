package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Project updateProjectStatus(Long id, String status) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isPresent()) {
            Project existingProject = project.get();
            existingProject.setStatus(status);
            return projectRepository.save(existingProject);
        } else {
            throw new RuntimeException("Project not found");
        }
    }
    
}
