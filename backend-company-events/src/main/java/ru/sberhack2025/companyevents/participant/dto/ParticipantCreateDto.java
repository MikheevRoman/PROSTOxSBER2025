package ru.sberhack2025.companyevents.participant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
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
public class ParticipantCreateDto {

    @Schema(description = "Telegram user id", example = "433566788")
    @NotNull(message = "Field \"tgUserId\" cannot be null")
    Long tgUserId;

    @Schema(description = "Telegram name", example = "Masha")
    @NotNull(message = "Field \"name\" cannot be null")
    String name;

    @Schema(description = "Event referral code", example = "43dfdke3fk")
    @NotNull(message = "Field \"eventRefCode\" cannot be null")
    String eventRefCode;

}
