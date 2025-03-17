package ru.sberhack2025.companyevents.common.error.exception.entity;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotUniqueException extends RuntimeException {
    public NotUniqueException(String message) {
        super(message);
    }
}
