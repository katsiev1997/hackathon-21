package org.hackathon21.backend.repository;

import org.hackathon21.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Optional<Vote> findByIdeaIdAndUserId(UUID ideaId, UUID userId);

    @Query("SELECT COALESCE(AVG(v.score), 0) FROM Vote v WHERE v.ideaId = :ideaId")
    Double getAverageScoreByIdeaId(UUID ideaId);

    long countByIdeaId(UUID ideaId);
}
