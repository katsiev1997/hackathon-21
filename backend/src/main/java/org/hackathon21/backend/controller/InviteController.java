package org.hackathon21.backend.controller;


import org.hackathon21.backend.dto.response.MyInviteResponse;
import org.hackathon21.backend.entity.Invite;
import org.hackathon21.backend.security.CurrentUserIdResolver;
import org.hackathon21.backend.service.InviteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InviteController {
    private final InviteService inviteService;
    private final CurrentUserIdResolver currentUserIdResolver;

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approveByCaptain(@PathVariable UUID id, @RequestHeader("X-User-ID") UUID captainId) {
        inviteService.approveByCaptain(id, captainId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> rejectByCaptain(@PathVariable UUID id, @RequestHeader("X-User-ID") UUID captainId) {
        inviteService.rejectByCaptain(id, captainId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<Void> acceptInvite(@PathVariable UUID id, @RequestHeader("X-User-ID") UUID userId) {
        inviteService.acceptInvite(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<Void> declineInvite(@PathVariable UUID id, @RequestHeader("X-User-ID") UUID userId) {
        inviteService.declineInvite(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/team/{teamId}/pending")
    public ResponseEntity<List<Invite>> getPendingForCaptain(@PathVariable UUID teamId) {
        return ResponseEntity.ok(inviteService.getPendingForCaptain(teamId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<MyInviteResponse>> getMyInvites(Authentication authentication) {
        UUID userId = currentUserIdResolver.requireCurrentUserId(authentication);
        return ResponseEntity.ok(inviteService.getMyInvites(userId));
    }
}