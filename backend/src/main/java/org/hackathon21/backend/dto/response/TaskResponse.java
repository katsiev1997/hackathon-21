package org.hackathon21.backend.dto.response;

import org.hackathon21.backend.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TaskResponse {
    private UUID id;
    private UUID teamId;
    private String title;
    private String description;
    private UUID assigneeId;
    private String assigneeName;
    private TaskStatus status;
    private LocalDate deadline;
    private UUID createdBy;
    private Integer position;
    private LocalDateTime createdAt;
}
