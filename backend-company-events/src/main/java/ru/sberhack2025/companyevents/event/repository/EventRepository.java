package ru.sberhack2025.companyevents.event.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.sberhack2025.companyevents.core.repository.DefaultRepository;
import ru.sberhack2025.companyevents.event.model.Event;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
public interface EventRepository extends DefaultRepository<Event> {

    @Override
    default Class<Event> getEntityClass() {
        return Event.class;
    }

    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.user.tgUserId = :userId")
    List<Event> findEventsByTgUserId(@Param("userId") Long userId);

}