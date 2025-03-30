package ru.sberhack2025.companyevents.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.event.dto.EventView;
import ru.sberhack2025.companyevents.notification.dto.NotificationDto;
import ru.sberhack2025.companyevents.notification.service.NotificationServiceImpl;

import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/company-events")
@Tag(name = "Notification controller", description = "Endpoints for notifications")
public class NotificationController {

    final private NotificationServiceImpl notificationService;


    @Operation(
            summary = "Отправить уведомление участнику",
            description = "Без ответа"
    )
    @PostMapping("notifications/send/participant/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@PathVariable UUID id, @Validated @RequestBody final NotificationDto notificationDto) {
        notificationService.sendNotificationToParticipant(id, notificationDto);
    }

    @Operation(
            summary = "Отправить уведомление юзеру по tgUserId",
            description = "Без ответа"
    )
    @PostMapping("notifications/send/user/{tgUserId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@PathVariable Long tgUserId, @Validated @RequestBody final NotificationDto notificationDto) {
        notificationService.sendNotificationToUser(tgUserId, notificationDto);
    }

}
