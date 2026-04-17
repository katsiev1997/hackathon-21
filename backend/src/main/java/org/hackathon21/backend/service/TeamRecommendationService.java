package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.response.RecommendedParticipantResponse;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.repository.TeamRepository;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamRecommendationService {

    private static final int MAX_TEAM_SIZE = 5;

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public List<RecommendedParticipantResponse> getRecommendedParticipants(UUID teamId, UUID requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (requester.getTeamId() == null || !requester.getTeamId().equals(teamId)) {
            throw new RuntimeException("forbidden: not a member of this team");
        }
        teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (userRepository.countByTeamId(teamId) >= MAX_TEAM_SIZE) {
            return List.of();
        }

        List<User> teammates = userRepository.findByTeamId(teamId);
        Set<String> teamSkillKeys = new HashSet<>();
        for (User m : teammates) {
            if (m.getSkills() == null) {
                continue;
            }
            for (String s : m.getSkills()) {
                if (s != null && !s.isBlank()) {
                    teamSkillKeys.add(s.toLowerCase(Locale.ROOT));
                }
            }
        }

        List<User> candidates = userRepository.findByLookingForTeamTrueAndTeamIdIsNull();

        List<RecommendedParticipantResponse> scored = new ArrayList<>();
        for (User c : candidates) {
            List<String> rawSkills = c.getSkills() != null ? c.getSkills() : List.of();
            List<String> complementary = new ArrayList<>();
            int overlap = 0;
            for (String s : rawSkills) {
                if (s == null || s.isBlank()) {
                    continue;
                }
                String key = s.toLowerCase(Locale.ROOT);
                if (teamSkillKeys.contains(key)) {
                    overlap++;
                } else {
                    complementary.add(s);
                }
            }
            int matchScore = complementary.size();
            scored.add(RecommendedParticipantResponse.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .role(c.getRole())
                    .skills(rawSkills.isEmpty() ? List.of() : List.copyOf(rawSkills))
                    .lookingForTeam(c.getLookingForTeam())
                    .matchScore(matchScore)
                    .overlapScore(overlap)
                    .complementarySkills(complementary)
                    .build());
        }

        return scored.stream()
                .sorted(Comparator
                        .comparingInt(RecommendedParticipantResponse::getMatchScore).reversed()
                        .thenComparingInt(RecommendedParticipantResponse::getOverlapScore).reversed()
                        .thenComparing(r -> r.getName() != null ? r.getName() : ""))
                .collect(Collectors.toList());
    }
}
