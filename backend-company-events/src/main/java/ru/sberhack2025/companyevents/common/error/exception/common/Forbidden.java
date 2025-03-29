package ru.sberhack2025.companyevents.common.error.exception.common;

/**
 * @author Andrey Kurnosov
 */
public class Forbidden extends RuntimeException {
    public Forbidden(String message) {
        super(message);
    }
}
