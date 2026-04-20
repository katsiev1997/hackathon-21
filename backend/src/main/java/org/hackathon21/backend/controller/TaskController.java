package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.request.PatchTaskRequest;
import org.hackathon21.backend.dto.response.TaskResponse;
import org.hackathon21.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponse> patchTask(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId,
            @RequestBody PatchTaskRequest request) {
        return ResponseEntity.ok(taskService.patchTask(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId) {
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }
}
