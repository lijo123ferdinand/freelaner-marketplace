package com.example.freelancer_marketplace.repos;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);
    void deleteByProjectId(Long projectId);
    List<Task> findByProjectId(Long projectId);

}
