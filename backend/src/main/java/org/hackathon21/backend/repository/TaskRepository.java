package org.hackathon21.backend.repository;

import org.hackathon21.backend.entity.Task;
import org.hackathon21.backend.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByTeamIdOrderByStatusAscPositionAsc(UUID teamId);

    @Query("SELECT COALESCE(MAX(t.position), -1) FROM Task t WHERE t.teamId = :teamId AND t.status = :status")
    Integer findMaxPosition(@Param("teamId") UUID teamId, @Param("status") TaskStatus status);
}
