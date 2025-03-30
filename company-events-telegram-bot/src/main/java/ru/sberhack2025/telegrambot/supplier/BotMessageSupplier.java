package ru.sberhack2025.telegrambot.supplier;

import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import ru.sberhack2025.telegrambot.bot.Command;
import ru.sberhack2025.telegrambot.services.procurements.ProcurementsResponseDto;

import java.util.List;

@Component
public class BotMessageSupplier {

    private final String INPUT_FIELD_PLACEHOLDER = "← Мероприятия здесь";

    private final String WELCOME_MESSAGE = "Привет, здесь ты можешь управлять своими мероприятиями";

    private final String PROCUREMENT_DESCRIPTION_PATTERN =
            """
            <b>%s</b> - <i>%s</i>
            
            Описание: %s
            """;

    private final String RESPONSIBLE_DESCRIPTION_PATTERN =
            """
            <b>%s</b> - <i>%s</i>
            Статус: %s
            
            Описание: %s
            """;

    private final String EMPTY_PROCUREMENTS_LIST_MESSAGE = "Пока ничего нет)";

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

    public SendMessage getProcurementDescription(Long userId, ProcurementsResponseDto procurementsResponseDto) {
        String messageText = String.format(
                PROCUREMENT_DESCRIPTION_PATTERN,
                procurementsResponseDto.getName(),
                procurementsResponseDto.getPrice().toString(),
                procurementsResponseDto.getComment()
        );

        return SendMessage.builder()
                .chatId(userId)
                .text(messageText)
                .parseMode(ParseMode.HTML)
                .build();
    }

    public SendMessage getResponsibleDescription(Long userId, ProcurementsResponseDto procurementsResponseDto) {
        String messageText = String.format(
                RESPONSIBLE_DESCRIPTION_PATTERN,
                procurementsResponseDto.getName(),
                procurementsResponseDto.getPrice().toString(),
                procurementsResponseDto.getCompletionStatus().getTelegramText(),
                procurementsResponseDto.getComment()
        );

        return SendMessage.builder()
                .chatId(userId)
                .text(messageText)
                .parseMode(ParseMode.HTML)
                .build();
    }

    public SendMessage getEmptyProcurementsListMessage(Long userId) {
        return SendMessage.builder()
                .chatId(userId)
                .text(EMPTY_PROCUREMENTS_LIST_MESSAGE)
                .build();
    }

}
