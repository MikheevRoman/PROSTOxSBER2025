package ru.sberhack2025.companyevents.common.error.exception.common;

/**
 * @author Andrey Kurnosov
 */
public class NotFound extends RuntimeException {
    public NotFound(String message) {
        super(message);
    }
}