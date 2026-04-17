package org.hackathon21.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {
    @NotBlank
    @Size(max = 200)
    private String title;
    private String description;
    private LocalDate deadline;
}
