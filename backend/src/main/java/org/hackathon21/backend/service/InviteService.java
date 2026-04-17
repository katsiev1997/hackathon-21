package org.hackathon21.backend.service;

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

@Service
@RequiredArgsConstructor
public class InviteService {
    private final InviteRepository inviteRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Transactional
    public void approveByCaptain(UUID inviteId, UUID captainId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        Team team = teamRepository.findById(invite.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptainId().equals(captainId)) {
            throw new RuntimeException("Only captain can approve invites");
        }

        if (invite.getStatus() != InviteStatus.pending_captain) {
            throw new RuntimeException("Invite not in pending_captain status");
        }

        invite.setStatus(InviteStatus.approved);
        inviteRepository.save(invite);
    }

    @Transactional
    public void rejectByCaptain(UUID inviteId, UUID captainId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        Team team = teamRepository.findById(invite.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptainId().equals(captainId)) {
            throw new RuntimeException("Only captain can reject invites");
        }

        if (invite.getStatus() != InviteStatus.pending_captain) {
            throw new RuntimeException("Invite not in pending_captain status");
        }

        invite.setStatus(InviteStatus.rejected);
        inviteRepository.save(invite);
    }

    @Transactional
    public void acceptInvite(UUID inviteId, UUID userId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getInviteeId().equals(userId)) {
            throw new RuntimeException("This invite is not for you");
        }

        if (invite.getStatus() != InviteStatus.approved) {
            throw new RuntimeException("Invite not approved by captain yet");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTeamId() != null) {
            throw new RuntimeException("User already in a team");
        }

        Team team = teamRepository.findById(invite.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        long memberCount = userRepository.findAll().stream()
                .filter(u -> team.getId().equals(u.getTeamId()))
                .count();
        if (memberCount >= 5) {
            throw new RuntimeException("Team is full");
        }

        user.setTeamId(team.getId());
        user.setLookingForTeam(false);
        user.setJoinedTeamAt(LocalDateTime.now());
        userRepository.save(user);

        invite.setStatus(InviteStatus.accepted);
        inviteRepository.save(invite);
    }

    @Transactional
    public void declineInvite(UUID inviteId, UUID userId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getInviteeId().equals(userId)) {
            throw new RuntimeException("This invite is not for you");
        }

        if (invite.getStatus() != InviteStatus.approved) {
            throw new RuntimeException("Invite not approved by captain yet");
        }

        invite.setStatus(InviteStatus.declined);
        inviteRepository.save(invite);
    }

    public List<Invite> getPendingForCaptain(UUID teamId) {
        return inviteRepository.findByTeamIdAndStatus(teamId, InviteStatus.pending_captain);
    }
}