package ru.sberhack2025.companyevents.participant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParticipantUpdateDto {

    @Schema(description = "True if organizer transfer money to participant", example = "true")
    Boolean hasPayment;
}
