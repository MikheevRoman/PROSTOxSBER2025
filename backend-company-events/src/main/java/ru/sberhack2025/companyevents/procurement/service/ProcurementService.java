package ru.sberhack2025.companyevents.procurement.service;

import ru.sberhack2025.companyevents.participant.dto.ParticipantCreateDto;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;
import ru.sberhack2025.companyevents.procurement.dto.ContributionView;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementCreateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementUpdateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementView;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface ProcurementService {

    List<ProcurementView> createAndGetAll(ProcurementCreateDto createDto);
    List<ProcurementView> updateAndGetAll(UUID entityId, ProcurementUpdateDto updateDto);
    List<ProcurementView> deleteAndGetAll(UUID entityId, UUID eventId);
    List<ProcurementView> getAllByEvent(UUID eventId);
    List<ProcurementView> getAllByResponsible(UUID participantId);
    List<ContributionView> getAllByContributor(UUID participantId);
}
