package ru.sberhack2025.telegrambot.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.telegrambot.notification.dto.NotificationResponse;
import ru.sberhack2025.telegrambot.notification.dto.NotificationRequest;
import ru.sberhack2025.telegrambot.notification.service.NotificationService;

@RestController
@RequestMapping("/notifier")
@Tag(name = "Уведомления", description = "Отправка сообщений пользователю")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/sendMessage")
    @Operation(
            summary = "Отправить сообщение",
            description = "Отправляет сообщение с указанным текстом определенному пользователю",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Сообщение отправлено"),
                    @ApiResponse(responseCode = "400", description = "Невалидные данные")
            }
    )
    public ResponseEntity<NotificationResponse> sendMessage(@RequestBody NotificationRequest notificationRequest) {
        return new ResponseEntity<>(notificationService.sendMessage(notificationRequest), HttpStatus.OK);
    }

}
