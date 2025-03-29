package ru.sberhack2025.companyevents.costresult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.costresult.dto.CostResultView;
import ru.sberhack2025.companyevents.costresult.service.CostResultService;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;
import ru.sberhack2025.companyevents.participant.service.ParticipantServiceImpl;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/company-events")
@Tag(name = "CostResult controller", description = "Endpoints for costResults")
public class CostResultController {

    private final CostResultService costResultService;

    @Operation(
            summary = "Получить всех участников мероприятия",
            description = "Поиск по id мероприятия (uuid)"
    )
    @GetMapping("events/{eventId}/cost-results")
    public List<CostResultView> getEventCostResults(@PathVariable UUID eventId) {
        return costResultService.getParticipantsTotals(eventId);
    }

}
