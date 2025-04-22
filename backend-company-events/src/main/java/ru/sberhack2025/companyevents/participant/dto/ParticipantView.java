package ru.sberhack2025.companyevents.participant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.dto.BaseView;

import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParticipantView extends BaseView {

    @Schema(description = "Participant id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "Participant name", example = "Masha")
    String name;

    @Schema(description = "True if organizer transfer money to participant", example = "true")
    Boolean hasPayment;

    @Schema(description = "Participant telegram user id", example = "433566788")
    Long tgUserId;

}
