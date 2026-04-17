package org.hackathon21.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class VoteRequest {
    @Min(1) @Max(5)
    private Integer score;
}
