package ru.sberhack2025.companyevents.participant.repository;

import ru.sberhack2025.companyevents.core.repository.DefaultRepository;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.user.model.User;

import java.util.Optional;

/**
 * @author Andrey Kurnosov
 */
public interface ParticipantRepository extends DefaultRepository<Participant> {

    @Override
    default Class<Participant> getEntityClass() {
        return Participant.class;
    }

    Optional<Participant> findByUserAndEvent(User user, Event event);

    default Boolean checkIfExists(User user, Event event) {
        return findByUserAndEvent(user, event).isPresent();
    }
}