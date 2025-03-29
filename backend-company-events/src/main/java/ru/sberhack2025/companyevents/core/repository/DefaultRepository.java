package ru.sberhack2025.companyevents.core.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import ru.sberhack2025.companyevents.common.error.exception.entity.EntityNotFoundException;
import ru.sberhack2025.companyevents.core.model.BaseEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@NoRepositoryBean
public interface DefaultRepository<E extends BaseEntity> extends CrudRepository<E, UUID> {

    Class<E> getEntityClass();

    Optional<E> findById(UUID id);

    List<E> findAll();

    default E find(UUID id) {
        return findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityClass(), id));
    }

}
