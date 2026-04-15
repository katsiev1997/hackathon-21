package org.hackathon21.backend.repository;

import org.hackathon21.backend.entity.Idea;
import org.hackathon21.backend.enums.IdeaStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IdeaRepository extends JpaRepository<Idea, UUID> {
    List<Idea> findByStatus(IdeaStatus status);

    List<Idea> findByAuthorId(UUID authorId);
}