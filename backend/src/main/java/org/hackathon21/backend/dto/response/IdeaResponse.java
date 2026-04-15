package org.hackathon21.backend.dto.response;

import org.hackathon21.backend.enums.IdeaStatus;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class IdeaResponse {
    private UUID id;
    private String title;
    private String description;
    private UUID authorId;
    private IdeaStatus status;
    private Double avgScore;
    private Long votesCount;
}
