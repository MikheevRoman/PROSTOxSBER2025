package ru.sberhack2025.companyevents.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.sberhack2025.companyevents.notification.dto.NotificationDto;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.user.model.User;
import ru.sberhack2025.companyevents.user.repository.UserRepository;

import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl {
    private final RestTemplate restTemplate;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;

    @Value("${telegram-bot.api-address}")
    private String telegramBotApiUrl;

    @Async
    public void sendNotification(NotificationDto notificationDto) {
        String url = telegramBotApiUrl + "/notifier/sendMessage";

        try {
            restTemplate.postForEntity(url, notificationDto, Void.class);
        } catch (Exception e) {
            log.error("Ошибка при отправке уведомления: {}", e.getMessage());
        }
    }

    public void sendNotificationToUser(Long tgUserId, NotificationDto notification) {
        User user = userRepository.find(tgUserId);
        notification.setUserId(user.getTgUserId());
        sendNotification(notification);
    }

    public void sendNotificationToParticipant(UUID participantId, NotificationDto notification) {
        User user = participantRepository.find(participantId).getUser();
        notification.setUserId(user.getTgUserId());
        sendNotification(notification);
    }
}
