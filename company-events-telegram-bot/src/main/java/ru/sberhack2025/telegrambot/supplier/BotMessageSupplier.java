package ru.sberhack2025.telegrambot.supplier;

import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import ru.sberhack2025.telegrambot.bot.Command;

import java.util.List;

@Component
public class BotMessageSupplier {

    private final String INPUT_FIELD_PLACEHOLDER = "← Мероприятия здесь";

    private final String WELCOME_MESSAGE = """
            Привет, здесь ты можешь управлять своими мероприятиями
            """;

    public SendMessage getWelcomeMessage(Long chatId) {
        List<KeyboardRow> keyboard = List.of(
                new KeyboardRow(new KeyboardButton(Command.GET_DEBT_LIST.COMMAND_TEXT)),
                new KeyboardRow(new KeyboardButton(Command.GET_MY_TASKS.COMMAND_TEXT))
        );

        ReplyKeyboardMarkup markup = ReplyKeyboardMarkup.builder()
                        .keyboard(keyboard)
                        .resizeKeyboard(true)
                        .inputFieldPlaceholder(INPUT_FIELD_PLACEHOLDER)
                        .build();

        return SendMessage.builder()
                .chatId(chatId)
                .text(WELCOME_MESSAGE)
                .replyMarkup(markup)
                .build();
    }

}
