package ru.sberhack2025.companyevents.event.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventView implements DateFormatter {

    @Schema(description = "Entity id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "User's name", example = "Маша")
    String name;

    @Schema(description = "Local date and time of event", example = "2025-07-14 16:30:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_TIME_PATTERN)
    LocalDateTime date;

    @Schema(description = "Event's location description", example = "Пляж солнечный")
    String place;

    @Schema(description = "Event's budget", example = "600")
    BigDecimal budget;

    @Schema(description = "Comment to event", example = "Funny comment")
    String comment;

    @Schema(description = "Comment to event", example = "Funny comment")
    String organizerCardInfo;

    @Schema(description = "Organizer's telegram user id", example = "111222333")
    Long organizerTgUserId;

    @Schema(description = "Event referral code", example = "faf063f0aad3")
    String eventRefCode;

    @Schema(description = "User creation time", example = "2024-07-14T11:12:13Z", format = INSTANT_PATTERN)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = INSTANT_PATTERN, timezone = "UTC")
    Instant createdAt;

}


