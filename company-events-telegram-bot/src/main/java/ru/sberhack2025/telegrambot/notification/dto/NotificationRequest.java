package ru.sberhack2025.telegrambot.notification.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationRequest {

    @Schema(description = "UserId получателя", example = "7881329438")
    Long userId;

    @Schema(description = "Текст сообщения", example = "Привет, родной")
    String messageText;

}
