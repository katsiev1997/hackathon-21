package org.hackathon21.backend.entity;

import org.hackathon21.backend.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Builder.Default
    @Column(columnDefinition = "TEXT[]")
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    @Column(name = "looking_for_team")
    private Boolean lookingForTeam = true;

    @Column(name = "team_id")
    private UUID teamId;  // пока что UUID(в идеале manyTOone

    @Column(name = "joined_team_at")
    private LocalDateTime joinedTeamAt;

    @Builder.Default
    @Column(name = "is_organizer")
    private Boolean isOrganizer = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}