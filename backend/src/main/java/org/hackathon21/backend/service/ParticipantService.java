package org.hackathon21.backend.service;


import org.hackathon21.backend.dto.response.ParticipantResponse;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.enums.UserRole;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipantService {
    private final UserRepository userRepository;

    public List<ParticipantResponse> getParticipants(UserRole role, String skill) {
        List<User> participants = userRepository.findByLookingForTeamTrueAndTeamIdIsNull();

        return participants.stream()
                .filter(user -> role == null || user.getRole() == role)
                .filter(user -> skill == null ||
                        (user.getSkills() != null && user.getSkills().stream().anyMatch(s -> s.equalsIgnoreCase(skill))))
                .map(user -> ParticipantResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .role(user.getRole())
                        .skills(user.getSkills())
                        .lookingForTeam(user.getLookingForTeam())
                        .build())
                .collect(Collectors.toList());
    }
}
