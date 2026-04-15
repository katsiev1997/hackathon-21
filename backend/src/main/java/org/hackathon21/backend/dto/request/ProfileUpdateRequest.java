package org.hackathon21.backend.dto.request;

import org.hackathon21.backend.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ProfileUpdateRequest {
    @NotBlank
    private String name;

    private UserRole role;

    private List<String> skills;

    private Boolean lookingForTeam;
}
