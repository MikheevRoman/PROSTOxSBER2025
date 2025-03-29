package ru.sberhack2025.telegrambot.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import ru.sberhack2025.telegrambot.bot.Bot;
import ru.sberhack2025.telegrambot.notification.dto.NotificationRequest;
import ru.sberhack2025.telegrambot.notification.dto.NotificationResponse;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final Bot bot;

    @Autowired
    public NotificationServiceImpl(Bot bot) {
        this.bot = bot;
    }

    @Override
    public NotificationResponse sendMessage(NotificationRequest notificationRequest) {
        SendMessage sendMessage = SendMessage.builder()
                .chatId(notificationRequest.getUserId())
                .text(notificationRequest.getMessageText())
                .build();

        bot.sendMessage(sendMessage);
        return new NotificationResponse("dobro");
    }

}
