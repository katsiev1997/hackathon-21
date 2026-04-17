package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.request.CreateTeamRequest;
import org.hackathon21.backend.dto.request.InviteRequest;
import org.hackathon21.backend.dto.response.InviteResponse;
import org.hackathon21.backend.dto.response.TeamResponse;
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
@CrossOrigin(origins = "*")
public class TeamController {
    private final TeamService teamService;

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