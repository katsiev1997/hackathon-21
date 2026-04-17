package org.hackathon21.backend.dto.response;

import org.hackathon21.backend.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RecommendedParticipantResponse {
    private UUID id;
    private String name;
    private UserRole role;
    private List<String> skills;
    private Boolean lookingForTeam;
    /** Число навыков кандидата, которых ещё нет ни у одного участника команды */
    private int matchScore;
    /** Число навыков, пересекающихся с навыками команды */
    private int overlapScore;
    /** Навыки кандидата, которыми он дополняет команду (ещё не представлены в составе) */
    private List<String> complementarySkills;
}
