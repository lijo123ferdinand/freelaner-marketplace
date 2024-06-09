package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.Task;
import com.example.freelancer_marketplace.repos.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

   
    public List<Task> createTasksForProject(Project project, List<Task> tasks) {
        tasks.forEach(task -> task.setProject(project));
        return taskRepository.saveAll(tasks);
    }

    public List<Task> getTasksByProject(Project project) {
        return taskRepository.findByProject(project);
    }

    @Transactional
    public void deleteTasksByProjectId(Long projectId) {
        taskRepository.deleteByProjectId(projectId);
    }
    public Optional<Task> updateTaskStatus(Long taskId, String status) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(status);
            taskRepository.save(task);
            return Optional.of(task);
        } else {
            return Optional.empty();
        }
    }
   
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    public double calculateStatusPercentageForProject(Long projectId) {
        List<Task> tasks = getTasksByProjectId(projectId);
        if (tasks.isEmpty()) {
            return 0.0; // Return 0 if no tasks exist for the project
        }

        long completedTaskCount = tasks.stream()
                .filter(task -> task.getStatus().equals("COMPLETED"))
                .count();
        double statusPercentage = (double) completedTaskCount / tasks.size() * 100.0;
        return statusPercentage;
    }

    public double calculateProjectCompletionPercentage(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) {
            return 0.0;
        }
        long completedTasks = tasks.stream().filter(task -> task.getStatus().equals("COMPLETED")).count();
        return (double) completedTasks / tasks.size() * 100;
    }
    
}
