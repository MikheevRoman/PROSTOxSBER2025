package ru.sberhack2025.companyevents.participant.service;

import ru.sberhack2025.companyevents.participant.dto.ParticipantCreateDto;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;
import ru.sberhack2025.companyevents.participant.model.Participant;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface ParticipantService {

    ParticipantView create(ParticipantCreateDto createDto);
    List<ParticipantView> getAllByEvent(UUID eventId);
    ParticipantView toView(Participant participant);
    List<ParticipantView> toView(List<Participant> participants);
    ParticipantView findByUserAndEvent(Long tgUserId, UUID eventId);
}
