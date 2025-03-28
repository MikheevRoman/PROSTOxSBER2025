package ru.sberhack2025.telegrambot.notification.service;

import ru.sberhack2025.telegrambot.notification.dto.NotificationRequest;
import ru.sberhack2025.telegrambot.notification.dto.NotificationResponse;

public interface NotificationService {

    NotificationResponse sendMessage(NotificationRequest notificationRequest);

}
