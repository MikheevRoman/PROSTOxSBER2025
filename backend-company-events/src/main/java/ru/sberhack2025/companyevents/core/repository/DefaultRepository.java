package ru.sberhack2025.companyevents.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
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
public interface DefaultRepository<E extends BaseEntity> extends JpaRepository<E, UUID> {

    Class<E> getEntityClass();

    Optional<E> findById(UUID id);

    List<E> findAll();

    default List<E> find(List<UUID> ids) {
        List<E> found = findAllById(ids);
        if (found.size() != ids.size()) {
            UUID missingId = ids.stream()
                    .filter(id -> found.stream().noneMatch(e -> e.getId().equals(id)))
                    .findFirst()
                    .orElse(null);
            if (missingId != null) {
                throw new EntityNotFoundException(getEntityClass(), missingId);
            }
        }
        return found;
    }

    default E find(UUID id) {
        return findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityClass(), id));
    }

}
