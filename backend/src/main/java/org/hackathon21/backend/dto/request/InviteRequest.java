package org.hackathon21.backend.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class InviteRequest {
    private UUID userId;
}
