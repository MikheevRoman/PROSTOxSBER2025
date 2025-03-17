package ru.sberhack2025.companyevents.common.error.exception.entity;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(Class<?> entityClass, Long entityId) {
        super("Entity " + entityClass.getSimpleName() + " not found. id=" + entityId);
    }

    public EntityNotFoundException(Class<?> entityClass, Long entityId, Long parentEntityId) {
        super("Entity " + entityClass.getSimpleName() +
                " not found. user_id=" + entityId +
                " and user_id_SE=" + parentEntityId);
    }

    public EntityNotFoundException(Class<?> entityClass, String entityId) {
        super("Entity " + entityClass.getSimpleName() + " not found. identifier=" + entityId);
    }

    public EntityNotFoundException(Class<?> entityClass, UUID entityId) {
        super("Entity " + entityClass.getSimpleName() + " not found. identifier=" + entityId);
    }
}
