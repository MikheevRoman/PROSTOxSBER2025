package ru.sberhack2025.companyevents.costresult.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.costresult.dto.CostResultView;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.event.repository.EventRepository;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.procurement.model.Procurement;
import ru.sberhack2025.companyevents.procurement.repository.ProcurementRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * @author Andrey Kurnosov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CostResultServiceImpl implements CostResultService {

    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;
    private final ProcurementRepository procurementRepository;

    @Value("${app.messages.cost-result}")
    private String costResultMessageTemplate;


    @Override
    @Transactional(readOnly = true)
    public List<CostResultView> getParticipantsTotals(UUID eventId) {
        Event event = eventRepository.find(eventId);
        List<Participant> participants = participantRepository.findByEventIdWithUser(eventId);
        return participants.stream().map(p -> calculateParticipantTotals(p, event)).toList();
    }

    private CostResultView calculateParticipantTotals(Participant participant, Event event) {
        BigDecimal eventParticipations = BigDecimal.valueOf(event.getParticipants().size());

        BigDecimal spentAmount = calculateSpentAmount(participant);
        BigDecimal owedAmount = calculateOwedAmount(participant, eventParticipations);
        BigDecimal totalAmount = owedAmount.subtract(spentAmount);
        String message = String.format(costResultMessageTemplate, participant.getUser().getName(), totalAmount.toString(), event.getOrganizerCardInfo());
        return CostResultView.builder()
                .participantId(participant.getId())
                .name(participant.getUser().getName())
                .spentAmount(spentAmount)
                .owedAmount(owedAmount)
                .totalAmount(totalAmount)
                .notificationMessage(message)
                .hasPayment(participant.getHasPayment())
                .build();
    }

    private BigDecimal calculateSpentAmount(Participant participant) {
        List<Procurement> procurements = procurementRepository.findByResponsibleAndStatus(
                participant,
                Procurement.FundraisingStatus.NONE,
                Procurement.CompletionStatus.DONE);

        return procurements.stream().map(Procurement::getPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

    }

    private BigDecimal calculateOwedAmount(Participant participant, BigDecimal eventParticipations) {
        List<Procurement> procurements = procurementRepository.findByContributorsAndStatus(
                participant,
                Procurement.FundraisingStatus.NONE,
                Procurement.CompletionStatus.DONE);

        return procurements.stream().map(p -> getPrice(
                        p,
                        BigDecimal.valueOf(p.getContributors().size()),
                        eventParticipations
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getPrice(Procurement procurement, BigDecimal contributors, BigDecimal eventParticipations) {
        BigDecimal price = Optional.ofNullable(procurement.getPrice()).orElse(BigDecimal.ZERO);
        if (procurement.getContributors().isEmpty()) {
            return price.divide(eventParticipations, RoundingMode.UP);
        } else {
            return price.divide(contributors, RoundingMode.UP);
        }
    }

}
