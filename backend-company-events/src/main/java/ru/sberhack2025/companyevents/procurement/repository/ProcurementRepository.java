package ru.sberhack2025.companyevents.procurement.repository;

import ru.sberhack2025.companyevents.core.repository.DefaultRepository;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
public interface ProcurementRepository extends DefaultRepository<Procurement> {

    @Override
    default Class<Procurement> getEntityClass() {
        return Procurement.class;
    }

    List<Procurement> findAllByEvent(Event event);
    List<Procurement> findAllByResponsible(Participant responsible);
    List<Procurement> findByContributorsContainingOrContributorsIsEmpty(Participant participant);

}