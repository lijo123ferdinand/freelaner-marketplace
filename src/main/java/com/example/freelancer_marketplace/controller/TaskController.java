package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.Task;
import com.example.freelancer_marketplace.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> createTasksForProject(
            @PathVariable Long projectId,
            @RequestBody List<Task> taskDetails) {
        Project project = new Project();
        project.setId(projectId);
        List<Task> tasks = taskService.createTasksForProject(project, taskDetails);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        Project project = new Project();
        project.setId(projectId);
        List<Task> tasks = taskService.getTasksByProject(project);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<Void> deleteTasksByProjectId(@PathVariable Long projectId) {
        taskService.deleteTasksByProjectId(projectId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody String status) {
        Optional<Task> updatedTask = taskService.updateTaskStatus(taskId, status);
        return updatedTask.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}/statusPercentage")
    public ResponseEntity<Double> getStatusPercentageForProject(@PathVariable Long projectId) {
        double statusPercentage = taskService.calculateStatusPercentageForProject(projectId);
        return ResponseEntity.ok(statusPercentage);
    }
    @GetMapping("/projects/statusPercentage")
public ResponseEntity<Map<Long, Double>> getProjectsStatusPercentage(@RequestParam List<Long> projectIds) {
    Map<Long, Double> projectStatusPercentageMap = new HashMap<>();
    for (Long projectId : projectIds) {
        double completionPercentage = taskService.calculateProjectCompletionPercentage(projectId);
        projectStatusPercentageMap.put(projectId, completionPercentage);
    }
    return ResponseEntity.ok(projectStatusPercentageMap);
}

}
