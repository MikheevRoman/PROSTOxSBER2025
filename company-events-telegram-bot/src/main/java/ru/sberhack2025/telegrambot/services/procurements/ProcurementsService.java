package ru.sberhack2025.telegrambot.services.procurements;

import java.util.List;
import java.util.UUID;

public interface ProcurementsService {

    List<ProcurementsResponseDto> getContributedProcurements(UUID participantId);

    List<ProcurementsResponseDto> getResponsibleProcurements(UUID participantId);

}
