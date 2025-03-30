package ru.sberhack2025.companyevents.costresult.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.costresult.dto.CostResultView;
import ru.sberhack2025.companyevents.costresult.service.CostResultService;

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
            summary = "Получить итоги мероприятия по каждому участнику",
            description = "Возвращает кто сколько потратил и сколько должен"
    )
    @GetMapping("events/{eventId}/cost-results")
    public List<CostResultView> getEventCostResults(@PathVariable UUID eventId) {
        return costResultService.getParticipantsTotals(eventId);
    }

}
