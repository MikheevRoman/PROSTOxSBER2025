package ru.sberhack2025.companyevents.event.service;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.common.base64.Base64Utils;
import ru.sberhack2025.companyevents.core.service.DefaultServiceImpl;
import ru.sberhack2025.companyevents.event.dto.EventCreateDto;
import ru.sberhack2025.companyevents.event.dto.EventUpdateDto;
import ru.sberhack2025.companyevents.event.dto.EventView;
import ru.sberhack2025.companyevents.event.mapper.EventMapper;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.event.repository.EventRepository;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.user.model.User;
import ru.sberhack2025.companyevents.user.repository.UserRepository;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
@Service
@Slf4j
public class EventServiceImpl extends DefaultServiceImpl<Event, EventCreateDto, EventUpdateDto, EventView, EventRepository, EventMapper> implements EventService {

    private final UserRepository userRepository;

    public EventServiceImpl(@Qualifier("eventRepository") EventRepository eventRepository,
                            EventMapper eventMapper,
                            UserRepository userRepository) {
        super(eventRepository, eventMapper);
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    protected Event toEntity(EventCreateDto createDto) {
        User user = userRepository.find(createDto.getTgUserId());
        Participant participant = Participant.builder().isOrganizer(true).build();
        user.addParticipations(participant);

        Event event = super.toEntity(createDto);
        event.addParticipant(participant);
        event.setOrganizer(participant);

        return event;
    }

    @Override
    @Transactional
    public List<EventView> getByTgUserId(Long tgUserId) {
        User user = userRepository.find(tgUserId);
        List<Event> events = repository.findEventsByTgUserId(user.getTgUserId());
        return events.stream().map(e -> enrichView(e, mapper.toView(e))).toList();
    }

    @Override
    protected EventView enrichView(Event event, EventView eventView) {
        Long organizerTgUserId = event.getOrganizer().getUser().getTgUserId();
        eventView.setOrganizerTgUserId(organizerTgUserId);
        eventView.setEventRefCode(Base64Utils.encodeUUID(event.getId()));
        return eventView;
    }


}
