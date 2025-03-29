package ru.sberhack2025.companyevents.costresult.service;

import ru.sberhack2025.companyevents.costresult.dto.CostResultView;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface CostResultService {
    List<CostResultView> getParticipantsTotals(UUID eventId);
}
