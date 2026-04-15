package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.request.CreateIdeaRequest;
import org.hackathon21.backend.dto.request.VoteRequest;
import org.hackathon21.backend.dto.response.IdeaResponse;
import org.hackathon21.backend.dto.response.VoteResponse;
import org.hackathon21.backend.enums.IdeaStatus;
import org.hackathon21.backend.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IdeaController {
    private final IdeaService ideaService;

    @PostMapping
    public ResponseEntity<IdeaResponse> createIdea(
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody CreateIdeaRequest request) {
        return ResponseEntity.ok(ideaService.createIdea(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<IdeaResponse>> getIdeas(
            @RequestParam(required = false) IdeaStatus status) {
        return ResponseEntity.ok(ideaService.getIdeas(status));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> vote(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody VoteRequest request) {
        return ResponseEntity.ok(ideaService.vote(userId, id, request));
    }
}