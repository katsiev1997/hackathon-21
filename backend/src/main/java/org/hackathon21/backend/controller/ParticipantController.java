package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.response.ParticipantResponse;
import org.hackathon21.backend.enums.UserRole;
import org.hackathon21.backend.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParticipantController {
    private final ParticipantService participantService;

    @GetMapping
    public ResponseEntity<List<ParticipantResponse>> getParticipants(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) String skill) {
        return ResponseEntity.ok(participantService.getParticipants(role, skill));
    }
}