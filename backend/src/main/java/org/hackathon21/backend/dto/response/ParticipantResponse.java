package org.hackathon21.backend.dto.response;

import org.hackathon21.backend.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ParticipantResponse {
    private UUID id;
    private String name;
    private UserRole role;
    private List<String> skills;
    private Boolean lookingForTeam;
}
