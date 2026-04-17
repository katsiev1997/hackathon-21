package org.hackathon21.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MyInviteResponse {
    private UUID inviteId;
    private UUID teamId;
    private String teamName;
    private UUID inviterId;
    private String status;
}
