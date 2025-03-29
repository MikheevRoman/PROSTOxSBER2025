package ru.sberhack2025.telegrambot.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.sberhack2025.telegrambot.notification.dto.NotificationResponse;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public NotificationResponse handleNotificationException(NotificationException exception) {
        log.error("cannot send message to user");
        return new NotificationResponse("cannot send message to user");
    }

}
