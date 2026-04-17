package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.request.CreateTeamRequest;
import org.hackathon21.backend.dto.request.InviteRequest;
import org.hackathon21.backend.dto.response.InviteResponse;
import org.hackathon21.backend.dto.response.TeamResponse;
import org.hackathon21.backend.entity.Invite;
import org.hackathon21.backend.entity.Team;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.enums.InviteStatus;
import org.hackathon21.backend.repository.InviteRepository;
import org.hackathon21.backend.repository.TeamRepository;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final InviteRepository inviteRepository;

    @Transactional
    public TeamResponse createTeam(UUID userId, CreateTeamRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTeamId() != null) {
            throw new RuntimeException("User already in a team");
        }

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .captainId(userId)
                .build();

        team = teamRepository.save(team);

        user.setTeamId(team.getId());
        user.setLookingForTeam(false);
        user.setJoinedTeamAt(LocalDateTime.now());
        userRepository.save(user);

        return buildTeamResponse(team);
    }

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::buildTeamResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeam(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return buildTeamResponse(team);
    }

    @Transactional
    public InviteResponse inviteUser(UUID teamId, UUID inviterId, InviteRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new RuntimeException("Inviter not found"));
        User invitee = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Invitee not found"));

        if (invitee.getTeamId() != null) {
            throw new RuntimeException("User already in a team");
        }

        long memberCount = userRepository.findAll().stream()
                .filter(u -> teamId.equals(u.getTeamId()))
                .count();
        if (memberCount >= 5) {
            throw new RuntimeException("Team is full (max 5 members)");
        }

        List<InviteStatus> activeStatuses = List.of(
                InviteStatus.pending_captain, InviteStatus.approved
        );
        if (inviteRepository.existsByTeamIdAndInviteeIdAndStatusIn(teamId, invitee.getId(), activeStatuses)) {
            throw new RuntimeException("Invite already exists");
        }

        InviteStatus initialStatus = inviter.getId().equals(team.getCaptainId())
                ? InviteStatus.approved : InviteStatus.pending_captain;

        Invite invite = Invite.builder()
                .teamId(teamId)
                .inviterId(inviterId)
                .inviteeId(invitee.getId())
                .status(initialStatus)
                .build();

        invite = inviteRepository.save(invite);

        return InviteResponse.builder()
                .inviteId(invite.getId())
                .status(invite.getStatus().name())
                .build();
    }

    @Transactional
    public void leaveTeam(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UUID teamId = user.getTeamId();
        if (teamId == null) {
            throw new RuntimeException("User not in a team");
        }

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        user.setTeamId(null);
        user.setLookingForTeam(true);
        user.setJoinedTeamAt(null);
        userRepository.save(user);

        long remainingMembers = userRepository.findAll().stream()
                .filter(u -> teamId.equals(u.getTeamId()))
                .count();

        if (remainingMembers == 0) {
            teamRepository.delete(team);
        } else if (team.getCaptainId().equals(userId) && remainingMembers > 0) {
            User newCaptain = userRepository.findAll().stream()
                    .filter(u -> teamId.equals(u.getTeamId()))
                    .min((u1, u2) -> u1.getJoinedTeamAt().compareTo(u2.getJoinedTeamAt()))
                    .orElse(null);
            if (newCaptain != null) {
                team.setCaptainId(newCaptain.getId());
                teamRepository.save(team);
            }
        }
    }

    private TeamResponse buildTeamResponse(Team team) {
        List<User> members = userRepository.findAll().stream()
                .filter(u -> team.getId().equals(u.getTeamId()))
                .collect(Collectors.toList());

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .captainId(team.getCaptainId())
                .createdAt(team.getCreatedAt())
                .members(members.stream()
                        .map(m -> TeamResponse.MemberDto.builder()
                                .id(m.getId())
                                .name(m.getName())
                                .role(m.getRole() != null ? m.getRole().name() : null)
                                .skills(m.getSkills())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}