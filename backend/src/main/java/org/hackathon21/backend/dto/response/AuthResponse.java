package org.hackathon21.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private UUID id;
    private String email;
    private String name;
    private String role;
}
