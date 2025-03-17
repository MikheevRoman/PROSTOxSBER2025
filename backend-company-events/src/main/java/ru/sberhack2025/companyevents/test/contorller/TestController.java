package ru.sberhack2025.companyevents.test.contorller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.test.dto.TestCreateDto;
import ru.sberhack2025.companyevents.test.dto.TestResponseDto;
import ru.sberhack2025.companyevents.test.dto.TestUpdateDto;
import ru.sberhack2025.companyevents.test.service.TestService;

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
@Tag(name = "Test controller", description = "Endpoints for testing")
public class TestController {

    private final TestService testService;

    @Operation(
            summary = "Создать тестовую сущность",
            description = "Возвращает объект с 2 полями: id и name"
    )
    @PostMapping("test")
    @ResponseStatus(HttpStatus.CREATED)
    public TestResponseDto create(@Validated @RequestBody final TestCreateDto createDto) {
        return testService.create(createDto);
    }


    @Operation(
            summary = "Получить все тестовые сущности",
            description = "Возвращает список объектов с 2 полями: id и name"
    )
    @GetMapping("test")
    public List<TestResponseDto> getAll() {
        return testService.getAll();
    }


    @Operation(
            summary = "Получить тестовую сущность по id",
            description = "Возвращает объект с 2 полями: id и name"
    )
    @GetMapping("test/{id}")
    public TestResponseDto getById(@PathVariable UUID id) {
        return testService.getById(id);
    }


    @Operation(
            summary = "Обновить тестовую сущность по id",
            description = "Возвращает обновленный объект с 2 полями: id и name"
    )
    @PatchMapping("test/{id}")
    public TestResponseDto update(@PathVariable UUID id, @Validated @RequestBody final TestUpdateDto updateDto) {
        return testService.update(id, updateDto);
    }

    @Operation(
            summary = "Удалить тестовую сущность по id",
            description = "Ничего не возвращает, только код 204"
    )
    @DeleteMapping("test/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable UUID id) {
        testService.delete(id);
    }
}
