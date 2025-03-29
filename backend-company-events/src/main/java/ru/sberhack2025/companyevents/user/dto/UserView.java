package ru.sberhack2025.companyevents.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;

import java.time.Instant;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserView implements DateFormatter {

    @Schema(description = "Entity id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "Telegram user id", example = "433566788")
    Long tgUserId;

    @Schema(description = "User's name", example = "Маша")
    String name;

    @Schema(description = "User creation time", example = "2024-07-14T11:12:13Z", format = INSTANT_PATTERN)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = INSTANT_PATTERN, timezone = "UTC")
    Instant createdAt;

}
