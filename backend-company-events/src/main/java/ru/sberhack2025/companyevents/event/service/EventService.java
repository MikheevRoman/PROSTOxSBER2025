package ru.sberhack2025.companyevents.event.service;

import ru.sberhack2025.companyevents.event.dto.EventView;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
public interface EventService {

    List<EventView> getByTgUserId(Long tgUserId);


}
