package ru.sberhack2025.companyevents.core.service;

import ru.sberhack2025.companyevents.core.dto.BaseView;
import ru.sberhack2025.companyevents.core.model.BaseEntity;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface DefaultService<
        E extends BaseEntity,
        CreateDto,
        UpdateDto,
        View extends BaseView
        > {

    View create(CreateDto createDto);

    View update(UUID id, UpdateDto updateDto);

    View getById(UUID id);

    List<View> getAll();

    void delete(UUID id);

}
