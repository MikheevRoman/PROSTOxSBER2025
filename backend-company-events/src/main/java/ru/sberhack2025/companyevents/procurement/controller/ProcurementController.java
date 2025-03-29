package ru.sberhack2025.companyevents.procurement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.procurement.dto.ContributionView;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementCreateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementUpdateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementView;
import ru.sberhack2025.companyevents.procurement.service.ProcurementServiceImpl;

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
@Tag(name = "Procurement controller", description = "Endpoints for procurements")
public class ProcurementController {

    private final ProcurementServiceImpl procurementService;


    @Operation(
            summary = "Создать закупку",
            description = "Возвращает все закупки мероприятия"
    )
    @PostMapping("events/{eventId}/procurements")
    @ResponseStatus(HttpStatus.CREATED)
    public List<ProcurementView> create(@PathVariable UUID eventId, @Validated @RequestBody final ProcurementCreateDto createDto) {
        createDto.setEventId(eventId);
        return procurementService.createAndGetAll(createDto);
    }

    @Operation(
            summary = "Обновить закупку по id (uuid)",
            description = "Возвращает все закупки мероприятия"
    )
    @PatchMapping("events/{eventId}/procurements/{id}")
    public List<ProcurementView> update(@PathVariable UUID eventId, @PathVariable UUID id, @Validated @RequestBody final ProcurementUpdateDto updateDto) {
        updateDto.setEventId(eventId);
        return procurementService.updateAndGetAll(id, updateDto);
    }


    @Operation(summary = "Получить все закупки юзера, за которые он платит")
    @GetMapping("participant/{participantId}/procurements/contributed")
    public List<ContributionView> getAllByContributor(@PathVariable UUID participantId) {
        return procurementService.getAllByContributor(participantId);
    }


    @Operation(summary = "Получить все закупки юзера, за которые он ответственен")
    @GetMapping("participant/{participantId}/procurements/responsible")
    public List<ProcurementView> getAllByResponsible(@PathVariable UUID participantId) {
        return procurementService.getAllByResponsible(participantId);
    }

    @Operation(summary = "Получить все закупки мероприятия")
    @GetMapping("events/{eventId}/procurements")
    public List<ProcurementView> getAllByEvent(@PathVariable UUID eventId) {
        return procurementService.getAllByEvent(eventId);
    }

    @Operation(summary = "Получить закупку по id (uuid)")
    @GetMapping("procurements/{id}")
    public ProcurementView getById(@PathVariable UUID id) {
        return procurementService.getById(id);
    }

    @Operation(
            summary = "Удалить мероприятие по id",
            description = "Ничего не возвращает, только код 204"
    )
    @DeleteMapping("events/{eventId}/procurements/{id}")
    public List<ProcurementView> deleteById(@PathVariable UUID eventId, @PathVariable UUID id) {
        return procurementService.deleteAndGetAll(id, eventId);
    }


}
