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
            Статус: %s
            <b>%s</b>
            Стоимость: <i>%s</i>
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

    public SendMessage getEmptyProcurementsListMessage(Long userId) {
        return SendMessage.builder()
                .chatId(userId)
                .text(EMPTY_PROCUREMENTS_LIST_MESSAGE)
                .build();
    }

    public SendMessage getContributedProcurementEventList(Long chatId, List<ProcurementsResponseDto> procurements) {
        StringBuilder stringBuilder = new StringBuilder();

        if (procurements.isEmpty()) {
            stringBuilder.append(EMPTY_PROCUREMENTS_LIST_MESSAGE);
        } else {
            procurements.stream()
                    .forEach(procurement -> stringBuilder.append(
                            String.format(
                                    PROCUREMENT_DESCRIPTION_PATTERN,
                                    procurement.getName(),
                                    procurement.getPrice().toString(),
                                    procurement.getComment()
                            )
                    ).append("""
                        
                        """));
        }

        return SendMessage.builder()
                .chatId(chatId)
                .text(stringBuilder.toString())
                .parseMode(ParseMode.HTML)
                .build();
    }

    public SendMessage getResponsibleProcurementEventList(Long chatId, List<ProcurementsResponseDto> procurements) {
        StringBuilder stringBuilder = new StringBuilder();

        if (procurements.isEmpty()) {
            stringBuilder.append(EMPTY_PROCUREMENTS_LIST_MESSAGE);
        } else {
            procurements.stream()
                    .forEach(procurement -> stringBuilder.append(
                            String.format(
                                    RESPONSIBLE_DESCRIPTION_PATTERN,
                                    procurement.getName(),
                                    procurement.getPrice().toString(),
                                    procurement.getCompletionStatus().getTelegramText(),
                                    procurement.getComment()
                            )
                    ).append("""
                        
                        """));
        }

        return SendMessage.builder()
                .chatId(chatId)
                .text(stringBuilder.toString())
                .parseMode(ParseMode.HTML)
                .build();
    }
}
