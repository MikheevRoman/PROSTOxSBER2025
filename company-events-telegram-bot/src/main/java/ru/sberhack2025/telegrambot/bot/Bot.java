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
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;
import ru.sberhack2025.telegrambot.exception.NotificationException;
import ru.sberhack2025.telegrambot.services.participants.ParticipantService;
import ru.sberhack2025.telegrambot.services.user.UserService;
import ru.sberhack2025.telegrambot.supplier.BotMessageSupplier;

import java.util.Optional;

@Component
@Slf4j
public class Bot implements LongPollingSingleThreadUpdateConsumer, SpringLongPollingBot {

    private final String botToken;

    private final TelegramClient telegramClient;

    private final BotMessageSupplier botMessageSupplier;

    private final UserService userService;

    private final ParticipantService participantService;

    @Autowired
    public Bot(
            @Qualifier("botToken") String botToken,
            TelegramClient telegramClient,
            BotMessageSupplier botMessageSupplier,
            UserService userService,
            ParticipantService participantService
    ) {
        this.botToken = botToken;
        this.botMessageSupplier = botMessageSupplier;
        this.telegramClient = telegramClient;
        this.userService = userService;
        this.participantService = participantService;
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
            User user = update.getMessage().getFrom();
            String messageText = update.getMessage().getText();

            if (isStartCommand(messageText)) {
                String name = getFullName(user);
                try {
                    String refLink = messageText.split(" ")[1];
                    participantService.createParticipant(chatId, name, refLink);
                } catch (ArrayIndexOutOfBoundsException e) {
                    userService.createUser(chatId, name);
                }
                sendMessage(botMessageSupplier.getWelcomeMessage(chatId));
            } else if (messageText.equals(Command.GET_DEBT_LIST.COMMAND_TEXT)) {
                //TODO
            } else if (messageText.equals(Command.GET_MY_TASKS.COMMAND_TEXT)) {
                //TODO
            }
        }
    }

    private String getFullName(User user) {
        return user.getFirstName() + Optional.ofNullable(user.getLastName()).map(s -> " " + s).orElse("");
    }

    private boolean isStartCommand(String command) {
        return command.split(" ")[0].equals(Command.START.COMMAND_TEXT);
    }

    public void sendMessage(SendMessage sendMessage) {
        try {
            telegramClient.execute(sendMessage);
        } catch (TelegramApiException e) {
            log.error("[{}] Cannot send message cause: {}", sendMessage.getChatId(), e.getMessage());
            throw new NotificationException("cannot send notification");
        }
    }
}
