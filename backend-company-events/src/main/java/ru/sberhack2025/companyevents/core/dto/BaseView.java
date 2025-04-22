package ru.sberhack2025.companyevents.core.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.MappedSuperclass;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;

import java.time.Instant;

/**
 * @author Andrey Kurnosov
 */
@Data
@NoArgsConstructor
@MappedSuperclass
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class BaseView implements DateFormatter {

    @Schema(description = "Entity creation time", example = "2024-07-14T11:12:13Z", format = INSTANT_PATTERN)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = INSTANT_PATTERN, timezone = "UTC")
    Instant createdAt;
}
