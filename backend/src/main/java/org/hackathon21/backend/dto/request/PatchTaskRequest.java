package org.hackathon21.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hackathon21.backend.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatchTaskRequest {
    private String title;
    private String description;
    private TaskStatus status;
    private UUID assigneeId;
    /** Если true — снять исполнителя */
    private Boolean clearAssignee;
    private LocalDate deadline;
    private Boolean clearDeadline;
    private Integer position;
}
