package ru.sberhack2025.companyevents.test.repository;

import org.springframework.data.repository.CrudRepository;
import ru.sberhack2025.companyevents.test.model.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface TestRepository extends CrudRepository<Test, UUID> {

    Optional<Test> findById(UUID id);

    List<Test> findAll();
}
