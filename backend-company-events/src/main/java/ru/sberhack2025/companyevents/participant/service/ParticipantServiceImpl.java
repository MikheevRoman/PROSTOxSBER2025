package ru.sberhack2025.companyevents.participant.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.common.base64.Base64Utils;
import ru.sberhack2025.companyevents.common.error.exception.entity.NotUniqueException;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.event.repository.EventRepository;
import ru.sberhack2025.companyevents.participant.dto.ParticipantCreateDto;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;
import ru.sberhack2025.companyevents.participant.mapper.ParticipantMapper;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.user.dto.UserCreateDto;
import ru.sberhack2025.companyevents.user.model.User;
import ru.sberhack2025.companyevents.user.repository.UserRepository;
import ru.sberhack2025.companyevents.user.service.UserServiceImpl;


/**
 * @author Andrey Kurnosov
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {

    private final UserRepository userRepository;
    private final UserServiceImpl userService;
    private final EntityManager entityManager;
    private final EventRepository eventRepository;
    private final ParticipantRepository repository;
    private final ParticipantMapper mapper;

    @Transactional
    @Override
    public ParticipantView create(ParticipantCreateDto createDto) {
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .tgUserId(createDto.getTgUserId())
                .name(createDto.getName())
                .build();
        userService.create(userCreateDto);
        try {
            entityManager.flush();
        } catch (NotUniqueException ignored) {
        }

        User user = userRepository.find(createDto.getTgUserId());
        Event event = eventRepository.find(Base64Utils.decodeUUID(createDto.getEventRefCode()));

        checkIfExistsOrThrow(user, event);

        Participant participant = Participant.builder().build();
        user.addParticipations(participant);
        event.addParticipant(participant);
        repository.save(participant);

        ParticipantView view = mapper.toView(participant);
        return toView(participant);
    }

    private ParticipantView toView(Participant participant) {
        ParticipantView view = mapper.toView(participant);
        view.setName(participant.getUser().getName());
        return view;
    }

    private void checkIfExistsOrThrow(User user, Event event) {
        if (repository.checkIfExists(user, event)) {
            throw new NotUniqueException("Participant already exists");
        }
    }
}
