package ru.sberhack2025.companyevents.event.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;
import ru.sberhack2025.companyevents.core.dto.BaseView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventView extends BaseView implements DateFormatter {

    @Schema(description = "Entity id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "User's name", example = "Маша")
    String name;

    @Schema(description = "Local date and time of event", example = "2024-07-14T11:12:13Z")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = INSTANT_PATTERN)
    LocalDateTime date;

    @Schema(description = "Event's location description", example = "Пляж солнечный")
    String place;

    @Schema(description = "Event's budget", example = "600")
    BigDecimal budget;

    @Schema(description = "Comment to event", example = "Funny comment")
    String comment;

    @Schema(description = "Organizer card info", example = "+7 (999) 999-99-99, сбер")
    String organizerCardInfo;

    @Schema(description = "Organizer's telegram user id", example = "111222333")
    Long organizerTgUserId;

    @Schema(description = "Event referral code", example = "faf063f0aad3")
    String eventRefCode;

}


