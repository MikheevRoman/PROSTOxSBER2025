package ru.sberhack2025.companyevents.procurement.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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


    @Query("SELECT p FROM Procurement p " +
            "WHERE p.fundraisingStatus = :fundraisingStatus " +
            "AND p.completionStatus = :completionStatus " +
            "AND p.responsible = :responsible")
    List<Procurement> findByResponsibleAndStatus(@Param("responsible") Participant responsible,
                                                 @Param("fundraisingStatus") Procurement.FundraisingStatus fundraisingStatus,
                                                 @Param("completionStatus") Procurement.CompletionStatus completionStatus);

    @Query("SELECT p FROM Procurement p " +
            "WHERE ( :participant MEMBER OF p.contributors OR p.contributors IS EMPTY ) " +
            "AND p.fundraisingStatus = :fundraisingStatus " +
            "AND p.completionStatus = :completionStatus")
    List<Procurement> findByContributorsAndStatus(
            @Param("participant") Participant participant,
            @Param("fundraisingStatus") Procurement.FundraisingStatus fundraisingStatus,
            @Param("completionStatus") Procurement.CompletionStatus completionStatus);

}