package ru.sberhack2025.telegrambot.services.procurements;

import lombok.Getter;

@Getter
public enum CompletionStatus {

    IN_PROGRESS("В процессе \uD83D\uDFE1"),

    DONE("Выполнено \uD83D\uDFE2");

    private final String telegramText;

    CompletionStatus(String telegramText) {
        this.telegramText = telegramText;
    }

}
