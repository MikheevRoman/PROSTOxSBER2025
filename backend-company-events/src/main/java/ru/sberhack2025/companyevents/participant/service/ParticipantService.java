package ru.sberhack2025.companyevents.participant.service;

import ru.sberhack2025.companyevents.participant.dto.ParticipantCreateDto;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;

/**
 * @author Andrey Kurnosov
 */
public interface ParticipantService {

    ParticipantView create(ParticipantCreateDto createDto);
}
