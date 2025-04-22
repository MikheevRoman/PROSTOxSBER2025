package ru.sberhack2025.companyevents.core.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.common.error.exception.entity.NotUniqueException;
import ru.sberhack2025.companyevents.core.dto.BaseView;
import ru.sberhack2025.companyevents.core.mapper.DefaultMapper;
import ru.sberhack2025.companyevents.core.model.BaseEntity;
import ru.sberhack2025.companyevents.core.repository.DefaultRepository;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Service
@RequiredArgsConstructor
@Slf4j
public abstract class DefaultServiceImpl<
        E extends BaseEntity,
        CreateDto,
        UpdateDto,
        View extends BaseView,
        Rep extends DefaultRepository<E>,
        Mapper extends DefaultMapper<E, CreateDto, UpdateDto, View>
        > implements DefaultService<E, CreateDto, UpdateDto, View> {

    protected final Rep repository;
    protected final Mapper mapper;


    @Override
    @Transactional
    public View create(CreateDto createDto) {
        checkIfNotExistsOrThrow(createDto);
        E entity = toEntity(createDto);
        repository.save(entity);
        return toView(entity);
    }

    @Override
    @Transactional
    public View update(UUID id, UpdateDto updateDto) {
        E entity = repository.find(id);
        return toView(mapper.update(updateDto, entity));
    }

    @Override
    public void delete(UUID id) {
        E entity = repository.find(id);
        repository.delete(entity);
    }

    @Override
    public View getById(UUID id) {
        E entity = repository.find(id);
        return toView(entity);
    }

    @Override
    public List<View> getAll() {
        List<E> entities = repository.findAll();
        return toView(entities);
    }


    protected View enrichView(E entity, View dto) {
        return dto;
    }

    protected E enrichEntity(E entity) {
        return entity;
    }

    protected E toEntity(CreateDto createDto) {
        E entity = mapper.fromDto(createDto);
        return enrichEntity(entity);
    }

    protected View toView(E entity) {
        View dto = mapper.toView(entity);
        return enrichView(entity, dto);
    }

    protected List<View> toView(List<E> entities) {
        return entities.stream()
            .map(e -> enrichView(e, mapper.toView(e)))
            .sorted(defaultSort())
            .toList();
    }

    protected Comparator<View> defaultSort() {
        return Comparator
            .comparing((View v) -> v.getCreatedAt())
            .reversed();
    }

    protected void checkIfNotExistsOrThrow(CreateDto createDto) {
        if (checkIfExists(createDto)) {
            throw new NotUniqueException("Entity already exists");
        }
    }

    protected Boolean checkIfExists(CreateDto createDto) {
        return false;
    }

}
