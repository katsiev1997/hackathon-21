package org.hackathon21.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateIdeaRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;
}