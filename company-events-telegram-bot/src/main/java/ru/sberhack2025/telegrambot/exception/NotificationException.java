package ru.sberhack2025.telegrambot.exception;

public class NotificationException extends RuntimeException {
    public NotificationException(String message) {
        super(message);
    }
}
