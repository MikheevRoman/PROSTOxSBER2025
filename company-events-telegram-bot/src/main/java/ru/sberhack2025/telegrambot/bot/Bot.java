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
import ru.sberhack2025.telegrambot.services.event.EventResponseDto;
import ru.sberhack2025.telegrambot.services.event.EventService;
import ru.sberhack2025.telegrambot.services.participant.ParticipantResponseDto;
import ru.sberhack2025.telegrambot.services.participant.ParticipantService;
import ru.sberhack2025.telegrambot.services.procurements.ProcurementsService;
import ru.sberhack2025.telegrambot.services.user.UserService;
import ru.sberhack2025.telegrambot.supplier.BotMessageSupplier;

import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class Bot implements LongPollingSingleThreadUpdateConsumer, SpringLongPollingBot {

    private final String botToken;
    private final TelegramClient telegramClient;
    private final BotMessageSupplier botMessageSupplier;
    private final UserService userService;
    private final ParticipantService participantService;
    private final ProcurementsService procurementsService;
    private final EventService eventService;

    /**
     * @param botToken токен бота
     * @param telegramClient клиент Telegram API
     * @param botMessageSupplier поставщик сообщений бота
     * @param userService сервис для работы с пользователями
     * @param participantService сервис для работы с участниками
     * @param procurementsService сервис для работы с закупками
     * @param eventService сервис для работы с событиями
     */
    @Autowired
    public Bot(
            @Qualifier("botToken") String botToken,
            TelegramClient telegramClient,
            BotMessageSupplier botMessageSupplier,
            UserService userService,
            ParticipantService participantService,
            ProcurementsService procurementsService,
            EventService eventService
    ) {
        this.botToken = botToken;
        this.botMessageSupplier = botMessageSupplier;
        this.telegramClient = telegramClient;
        this.userService = userService;
        this.participantService = participantService;
        this.procurementsService = procurementsService;
        this.eventService = eventService;
    }

    /**
     * Возвращает токен бота.
     *
     * @return токен бота
     */
    @Override
    public String getBotToken() {
        return this.botToken;
    }

    /**
     * Возвращает текущий объект как потребитель обновлений.
     *
     * @return текущий объект бота
     */
    @Override
    public LongPollingUpdateConsumer getUpdatesConsumer() { return this; }

    /**
     * Метод, вызываемый после регистрации бота.
     * Логирует статус работы бота.
     *
     * @param botSession сессия бота
     */
    @AfterBotRegistration
    private void afterRegistration(BotSession botSession) {
        log.info("Registered bot run status: {}", botSession.isRunning());
    }

    /**
     * Обрабатывает входящие обновления от Telegram.
     *
     * @param update входящее обновление
     */
    @Override
    public void consume(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            Long chatId = update.getMessage().getChatId();
            User user = update.getMessage().getFrom();
            String messageText = update.getMessage().getText();

            if (isStartCommand(messageText)) {
                handleStartCommand(chatId, user, messageText);
            } else if (messageText.equals(Command.GET_DEBT_LIST.COMMAND_TEXT)) {
                handleDebtListCommand(chatId);
            } else if (messageText.equals(Command.GET_MY_TASKS.COMMAND_TEXT)) {
                handleMyTasksCommand(chatId);
            }
        }
    }

    /**
     * Формирует полное имя пользователя из имени и фамилии.
     *
     * @param user объект пользователя Telegram
     * @return полное имя пользователя
     */
    private String getFullName(User user) {
        return user.getFirstName() + Optional.ofNullable(user.getLastName()).map(s -> " " + s).orElse("");
    }

    /**
     * Проверяет, является ли сообщение командой /start.
     *
     * @param command текст сообщения
     * @return true, если сообщение является командой /start, иначе false
     */
    private boolean isStartCommand(String command) {
        return command.split(" ")[0].equals(Command.START.COMMAND_TEXT);
    }

    /**
     * Отправляет сообщение пользователю через Telegram API.
     *
     * @param sendMessage объект сообщения для отправки
     * @throws NotificationException если не удалось отправить сообщение
     */
    public void sendMessage(SendMessage sendMessage) {
        try {
            telegramClient.execute(sendMessage);
        } catch (TelegramApiException e) {
            log.error("[{}] Cannot send message cause: {}", sendMessage.getChatId(), e.getMessage());
            throw new NotificationException("cannot send notification");
        }
    }

    /**
     * Обрабатывает команду /start.
     *
     * @param chatId идентификатор чата
     * @param user пользователь, отправивший команду
     * @param messageText текст сообщения
     */
    private void handleStartCommand(Long chatId, User user, String messageText) {
        String name = getFullName(user);
        try {
            String refLink = messageText.split(" ")[1];
            participantService.createParticipant(chatId, name, refLink);
        } catch (ArrayIndexOutOfBoundsException e) {
            userService.createUser(chatId, name);
        }
        sendMessage(botMessageSupplier.getWelcomeMessage(chatId));
    }

    /**
     * Обрабатывает запрос списка долгов.
     *
     * @param chatId идентификатор чата
     */
    private void handleDebtListCommand(Long chatId) {
        List<EventResponseDto> events = eventService.getUserEvents(chatId);
        if (events.isEmpty()) {
            sendMessage(botMessageSupplier.getEmptyProcurementsListMessage(chatId));
        } else {
            events.stream()
                    .map(eventResponseDto -> participantService.getEventParticipant(eventResponseDto.getId(), chatId))
                    .map(ParticipantResponseDto::getId)
                    .map(procurementsService::getContributedProcurements)
                    .forEach(procurement -> sendMessage(botMessageSupplier.getContributedProcurementEventList(chatId, procurement)));
        }
    }

    /**
     * Обрабатывает запрос списка задач пользователя.
     *
     * @param chatId идентификатор чата
     */
    private void handleMyTasksCommand(Long chatId) {
        List<EventResponseDto> events = eventService.getUserEvents(chatId);
        if (events.isEmpty()) {
            sendMessage(botMessageSupplier.getEmptyProcurementsListMessage(chatId));
        } else {
            events.stream()
                    .map(eventResponseDto -> participantService.getEventParticipant(eventResponseDto.getId(), chatId))
                    .map(ParticipantResponseDto::getId)
                    .map(procurementsService::getResponsibleProcurements)
                    .forEach(procurement -> sendMessage(botMessageSupplier.getResponsibleProcurementEventList(chatId, procurement)));
        }
    }
}