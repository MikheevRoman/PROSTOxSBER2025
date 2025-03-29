package ru.sberhack2025.companyevents.core.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.core.model.BaseEntity;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
public interface DefaultMapper<E extends BaseEntity, CreateDto, UpdateDto, View> {

    E fromDto(CreateDto createDto);

    View toView(E entity);

    List<View> toView(List<E> entityList);

    E update(UpdateDto updateDto, @MappingTarget E entity);
}
