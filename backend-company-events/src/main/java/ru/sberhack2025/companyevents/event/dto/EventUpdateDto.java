package ru.sberhack2025.companyevents.event.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventUpdateDto implements DateFormatter {

    @Schema(description = "Event's name", example = "Поездка на финский залив")
    String name;

    @Schema(description = "Local date and time of event", example = "2025-07-14 16:30:00")
    LocalDateTime date;

    @Schema(description = "Event's location description", example = "Пляж солнечный")
    String place;

    @Schema(description = "Event's budget", example = "600")
    @Min(value = 0, message = "Budget cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Budget must be up to 10 digits in integral part and 2 in fraction")
    BigDecimal budget;

    @Schema(description = "Organizer card info", example = "+7 (999) 999-99-99, сбер")
    String organizerCardInfo;

    @Schema(description = "Comment to event", example = "Funny comment")
    String comment;

    @Schema(hidden = true)
    Long tgUserId;
}
