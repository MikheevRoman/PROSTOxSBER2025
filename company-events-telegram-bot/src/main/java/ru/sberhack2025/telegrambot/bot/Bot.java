package ru.sberhack2025.telegrambot.bot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.longpolling.BotSession;
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer;
import org.telegram.telegrambots.longpolling.starter.AfterBotRegistration;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;
import ru.sberhack2025.telegrambot.supplier.BotMessageSupplier;

@Component
@Slf4j
public class Bot implements LongPollingSingleThreadUpdateConsumer, SpringLongPollingBot {

    private final String botToken;

    private final TelegramClient telegramClient;

    private final BotMessageSupplier botMessageSupplier;

    @Autowired
    public Bot(@Qualifier("botToken") String botToken, TelegramClient telegramClient, BotMessageSupplier botMessageSupplier) {
        this.botToken = botToken;
        this.botMessageSupplier = botMessageSupplier;
        this.telegramClient = telegramClient;
    }

    @Override
    public String getBotToken() {
        return this.botToken;
    }

    @Override
    public LongPollingUpdateConsumer getUpdatesConsumer() { return this; }

    @AfterBotRegistration
    private void afterRegistration(BotSession botSession) {
        log.info("Registered bot run status: {}", botSession.isRunning());
    }

    @Override
    public void consume(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            Long chatId = update.getMessage().getChatId();
            String messageText = update.getMessage().getText();

            if (messageText.equals("/start")) {
                sendMessage(botMessageSupplier.getWelcomeMessage(chatId));
            }
        }
    }

    public void sendMessage(SendMessage sendMessage) {
        try {
            telegramClient.execute(sendMessage);
        } catch (TelegramApiException e) {
            log.error("[{}] Cannot send message cause: {}", sendMessage.getChatId(), e.getMessage());
        }
    }
}
