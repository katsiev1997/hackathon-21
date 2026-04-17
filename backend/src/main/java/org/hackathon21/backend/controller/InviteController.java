package org.hackathon21.backend.controller;


import org.hackathon21.backend.service.InviteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InviteController {
    private final InviteService inviteService;

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
}