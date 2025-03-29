package ru.sberhack2025.companyevents.event.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.core.mapper.DefaultMapper;
import ru.sberhack2025.companyevents.event.dto.EventCreateDto;
import ru.sberhack2025.companyevents.event.dto.EventUpdateDto;
import ru.sberhack2025.companyevents.event.dto.EventView;
import ru.sberhack2025.companyevents.event.model.Event;

/**
 * @author Andrey Kurnosov
 */
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EventMapper extends DefaultMapper<Event, EventCreateDto, EventUpdateDto, EventView> {
}
