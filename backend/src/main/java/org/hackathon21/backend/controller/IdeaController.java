package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.request.CreateIdeaRequest;
import org.hackathon21.backend.dto.request.VoteRequest;
import org.hackathon21.backend.dto.response.IdeaResponse;
import org.hackathon21.backend.dto.response.VoteResponse;
import org.hackathon21.backend.enums.IdeaStatus;
import org.hackathon21.backend.security.CurrentUserIdResolver;
import org.hackathon21.backend.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
public class IdeaController {
    private final IdeaService ideaService;
    private final CurrentUserIdResolver currentUserIdResolver;

    @PostMapping
    public ResponseEntity<IdeaResponse> createIdea(
            Authentication authentication,
            @Valid @RequestBody CreateIdeaRequest request) {
        return ResponseEntity.ok(
                ideaService.createIdea(currentUserIdResolver.requireCurrentUserId(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<IdeaResponse>> getIdeas(
            @RequestParam(required = false) IdeaStatus status,
            @RequestParam(required = false, defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(ideaService.getIdeas(status, sort));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> vote(
            @PathVariable UUID id,
            Authentication authentication,
            @Valid @RequestBody VoteRequest request) {
        return ResponseEntity.ok(
                ideaService.vote(currentUserIdResolver.requireCurrentUserId(authentication), id, request));
    }

    /** Перевести идею из черновика в статус голосования (только автор). */
    @PostMapping("/{id}/submit-for-voting")
    public ResponseEntity<IdeaResponse> submitForVoting(
            @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(
                ideaService.submitForVoting(currentUserIdResolver.requireCurrentUserId(authentication), id));
    }

    /** Организатор: перевести идею из голосования в «одобрено». */
    @PostMapping("/{id}/approve")
    public ResponseEntity<IdeaResponse> approveIdea(
            @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(
                ideaService.approveIdeaByOrganizer(currentUserIdResolver.requireCurrentUserId(authentication), id));
    }

    /** Организатор: перевести идею из «одобрено» в «в работе». */
    @PostMapping("/{id}/start")
    public ResponseEntity<IdeaResponse> startIdea(
            @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(
                ideaService.startIdeaByOrganizer(currentUserIdResolver.requireCurrentUserId(authentication), id));
    }
}
