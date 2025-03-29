package ru.sberhack2025.companyevents.user.repository;

import ru.sberhack2025.companyevents.common.error.exception.entity.EntityNotFoundException;
import ru.sberhack2025.companyevents.core.repository.DefaultRepository;
import ru.sberhack2025.companyevents.user.model.User;

import java.util.Optional;

/**
 * @author Andrey Kurnosov
 */
public interface UserRepository extends DefaultRepository<User> {

    @Override
    default Class<User> getEntityClass() {
        return User.class;
    }

    Optional<User> findByTgUserId(Long tgUserId);

    default User find(Long tgUserId) {
        return findByTgUserId(tgUserId)
                .orElseThrow(() -> new EntityNotFoundException(getEntityClass(), tgUserId));
    }

    default Boolean checkIfExists(Long tgUserId) {
        return findByTgUserId(tgUserId).isPresent();
    }
}