package ru.sberhack2025.companyevents.common.error.exception.common;

/**
 * @author Andrey Kurnosov
 */
public class BadRequest extends RuntimeException {
    public BadRequest(String message) {
        super(message);
    }
}