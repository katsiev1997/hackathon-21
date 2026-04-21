package org.hackathon21.backend.controller;

import org.hackathon21.backend.dto.response.ProfileResponse;
import org.hackathon21.backend.dto.request.ProfileUpdateRequest;
import org.hackathon21.backend.security.CurrentUserIdResolver;
import org.hackathon21.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final CurrentUserIdResolver currentUserIdResolver;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getProfile(currentUserIdResolver.requireCurrentUserId(authentication)));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(
                profileService.updateProfile(currentUserIdResolver.requireCurrentUserId(authentication), request));
    }
}
