package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.request.CreateTeamRequest;
import org.hackathon21.backend.dto.request.CreateTaskRequest;
import org.hackathon21.backend.dto.request.InviteRequest;
import org.hackathon21.backend.dto.response.InviteResponse;
import org.hackathon21.backend.dto.response.RecommendedParticipantResponse;
import org.hackathon21.backend.dto.response.TaskResponse;
import org.hackathon21.backend.dto.response.TeamResponse;
import org.hackathon21.backend.service.TaskService;
import org.hackathon21.backend.service.TeamRecommendationService;
import org.hackathon21.backend.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final TeamRecommendationService teamRecommendationService;
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.createTeam(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable UUID id) {
        return ResponseEntity.ok(teamService.getTeam(id));
    }

    @GetMapping("/{teamId}/recommended-participants")
    public ResponseEntity<List<RecommendedParticipantResponse>> getRecommendedParticipants(
            @PathVariable UUID teamId,
            @RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(teamRecommendationService.getRecommendedParticipants(teamId, userId));
    }

    @GetMapping("/{teamId}/tasks")
    public ResponseEntity<List<TaskResponse>> listTasks(
            @PathVariable UUID teamId,
            @RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(taskService.listTasks(teamId, userId));
    }

    @PostMapping("/{teamId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID teamId,
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(teamId, userId, request));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<InviteResponse> inviteUser(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody InviteRequest request) {
        return ResponseEntity.ok(teamService.inviteUser(id, userId, request));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveTeam(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId) {
        teamService.leaveTeam(userId);
        return ResponseEntity.ok().build();
    }
}
