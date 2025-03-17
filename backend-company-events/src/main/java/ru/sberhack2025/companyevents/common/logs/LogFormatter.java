package ru.sberhack2025.companyevents.common.logs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

/**
 * @author Andrey Kurnosov
 */
public interface LogFormatter {

    default Logger getLogger() {
        return LoggerFactory.getLogger(this.getClass());
    }

    default void logError(String error, String message) {
        getLogger().error("Error: {} / Description: {}", error, message);
    }

    default void logError(HttpStatus error, String message) {
        logError(error.getReasonPhrase(), message);
    }

    default void logError(HttpStatus error, Exception exception) {
        logError(error.getReasonPhrase(), exception.getMessage());
    }
}
