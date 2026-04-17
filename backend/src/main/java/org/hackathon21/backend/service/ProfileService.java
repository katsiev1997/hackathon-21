package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.response.ProfileResponse;
import org.hackathon21.backend.dto.request.ProfileUpdateRequest;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .skills(user.getSkills())
                .lookingForTeam(user.getLookingForTeam())
                .teamId(user.getTeamId())
                .isOrganizer(user.getIsOrganizer())
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getLookingForTeam() != null) user.setLookingForTeam(request.getLookingForTeam());

        user = userRepository.save(user);

        return ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .skills(user.getSkills())
                .lookingForTeam(user.getLookingForTeam())
                .teamId(user.getTeamId())
                .isOrganizer(user.getIsOrganizer())
                .build();
    }
}
