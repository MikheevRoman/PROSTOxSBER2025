package ru.sberhack2025.companyevents.event.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.event.dto.EventCreateDto;
import ru.sberhack2025.companyevents.event.dto.EventUpdateDto;
import ru.sberhack2025.companyevents.event.dto.EventView;
import ru.sberhack2025.companyevents.event.service.EventServiceImpl;

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
@Tag(name = "Event controller", description = "Endpoints for events")
public class EventController {
    private final EventServiceImpl eventService;

    @Operation(
            summary = "Создать мероприятие",
            description = ""
    )
    @PostMapping("users/{userId}/events")
    @ResponseStatus(HttpStatus.CREATED)
    public EventView create(@PathVariable Long userId, @Validated @RequestBody final EventCreateDto createDto) {
        createDto.setTgUserId(userId);
        return eventService.create(createDto);
    }


    @Operation(
            summary = "Получить все мероприятия юзера",
            description = "Возвращает все мероприятия юзера"
    )
    @GetMapping("users/{userId}/events")
    public List<EventView> getAllByUser(@PathVariable Long userId) {
        return eventService.getByTgUserId(userId);
    }


    @Operation(
            summary = "Получить мероприятие по id (uuid)",
            description = ""
    )
    @GetMapping("events/{id}")
    public EventView getById(@PathVariable UUID id) {
        return eventService.getById(id);
    }


    @Operation(
            summary = "Обновить мероприятие по id (uuid)",
            description = "Возвращает обновленное мероприятие"
    )
    @PatchMapping("events/{id}")
    public EventView update(@PathVariable UUID id, @Validated @RequestBody final EventUpdateDto updateDto) {
        return eventService.update(id, updateDto);
    }

    @Operation(
            summary = "Удалить мероприятие по id",
            description = "Ничего не возвращает, только код 204"
    )
    @DeleteMapping("events/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable UUID id) {
        eventService.delete(id);
    }


}
