package org.hackathon21.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TeamResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID captainId;
    private List<MemberDto> members;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class MemberDto {
        private UUID id;
        private String name;
        private String role;
        private List<String> skills;
    }
}