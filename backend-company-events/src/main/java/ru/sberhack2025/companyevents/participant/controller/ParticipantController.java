package ru.sberhack2025.companyevents.participant.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.participant.dto.ParticipantCreateDto;
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
@Tag(name = "Participant controller", description = "Endpoints for participants")
public class ParticipantController {

    private final ParticipantServiceImpl participantService;

    @Operation(
            summary = "Создать участника",
            description = ""
    )
    @PostMapping("participants")
    @ResponseStatus(HttpStatus.CREATED)
    public ParticipantView create(@Validated @RequestBody final ParticipantCreateDto createDto) {
        return participantService.create(createDto);
    }

    @Operation(
            summary = "Получить всех участников мероприятия",
            description = "Поиск по id мероприятия (uuid)"
    )
    @GetMapping("events/{eventId}/participants")
    public List<ParticipantView> getAllByUser(@PathVariable UUID eventId) {
        return participantService.getAllByEvent(eventId);
    }
}
