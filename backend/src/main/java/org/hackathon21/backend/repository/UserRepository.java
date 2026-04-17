package org.hackathon21.backend.repository;

import org.hackathon21.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findByLookingForTeamTrueAndTeamIdIsNull();
    List<User> findByTeamId(UUID teamId);
    long countByTeamId(UUID teamId);
}
