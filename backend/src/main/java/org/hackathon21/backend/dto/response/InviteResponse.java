package org.hackathon21.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class InviteResponse {
    private UUID inviteId;
    private String status;
}
