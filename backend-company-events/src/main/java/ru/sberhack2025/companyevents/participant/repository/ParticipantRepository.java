package ru.sberhack2025.companyevents.participant.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.sberhack2025.companyevents.core.repository.DefaultRepository;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.user.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface ParticipantRepository extends DefaultRepository<Participant> {

    @Override
    default Class<Participant> getEntityClass() {
        return Participant.class;
    }

    Optional<Participant> findByUserAndEvent(User user, Event event);

    @Query("SELECT p FROM Participant p JOIN FETCH p.user WHERE p.event.id = :eventId")
    List<Participant> findByEventIdWithUser(@Param("eventId") UUID eventId);

    default Boolean checkIfExists(User user, Event event) {
        return findByUserAndEvent(user, event).isPresent();
    }
}