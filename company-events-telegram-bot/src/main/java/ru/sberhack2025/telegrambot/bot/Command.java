package ru.sberhack2025.telegrambot.bot;

public enum Command {

    START("/start"),

    GET_DEBT_LIST("На что я скидываюсь?"),

    GET_MY_TASKS("Мои задачи");

    public final String COMMAND_TEXT;

    Command(String commandText) {
        this.COMMAND_TEXT = commandText;
    }

}
