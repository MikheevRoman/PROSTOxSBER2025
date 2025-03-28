package ru.sberhack2025.telegrambot.notification.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.telegrambot.notification.dto.NotificationResponse;
import ru.sberhack2025.telegrambot.notification.dto.NotificationRequest;
import ru.sberhack2025.telegrambot.notification.service.NotificationService;

@RestController
@RequestMapping("/notifier")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<NotificationResponse> sendMessage(@RequestBody NotificationRequest notificationRequest) {
        return new ResponseEntity<>(notificationService.sendMessage(notificationRequest), HttpStatus.OK);
    }

}
