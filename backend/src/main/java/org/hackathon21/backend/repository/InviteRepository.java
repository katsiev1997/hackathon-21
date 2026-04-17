package org.hackathon21.backend.repository;

import org.hackathon21.backend.entity.Invite;
import org.hackathon21.backend.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InviteRepository extends JpaRepository<Invite, UUID> {
    List<Invite> findByTeamIdAndStatus(UUID teamId, InviteStatus status);
    List<Invite> findByInviteeIdAndStatus(UUID inviteeId, InviteStatus status);
    List<Invite> findByInviteeIdAndStatusIn(UUID inviteeId, List<InviteStatus> statuses);
    boolean existsByTeamIdAndInviteeIdAndStatusIn(UUID teamId, UUID inviteeId, List<InviteStatus> statuses);
}