package ru.sberhack2025.companyevents.notification.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationDto {

    @Schema(hidden = true)
    Long userId;

    @Schema(description = "Notification's text", example = "Hi there")
    @NotNull(message = "Field \"messageText\" cannot be null")
    String messageText;

}
