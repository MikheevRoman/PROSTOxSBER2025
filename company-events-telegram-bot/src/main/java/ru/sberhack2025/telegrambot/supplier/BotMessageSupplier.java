package ru.sberhack2025.telegrambot.supplier;

import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import java.util.List;

@Component
public class BotMessageSupplier {

    public SendMessage getWelcomeMessage(Long chatId) {
        ReplyKeyboardMarkup replyKeyboardMarkup = new ReplyKeyboardMarkup(List.of(
                new KeyboardRow(new KeyboardButton("На что я скидываюсь?")),
                new KeyboardRow(new KeyboardButton("Мои задачи"))
        ));

        return SendMessage.builder()
                .chatId(chatId)
                .text("HI")
                .replyMarkup(replyKeyboardMarkup)
                .build();
    }

}
