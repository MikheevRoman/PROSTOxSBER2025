package ru.sberhack2025.companyevents.test.contorller;

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

    @PostMapping("test")
    @ResponseStatus(HttpStatus.CREATED)
    public TestResponseDto create(@Validated @RequestBody final TestCreateDto createDto) {
        return testService.create(createDto);
    }

    @GetMapping("test")
    public List<TestResponseDto> getAll() {
        return testService.getAll();
    }

    @GetMapping("test/{id}")
    public TestResponseDto getById(@PathVariable UUID id) {
        return testService.getById(id);
    }

    @PatchMapping("test/{id}")
    public TestResponseDto update(@PathVariable UUID id, @Validated @RequestBody final TestUpdateDto updateDto) {
        return testService.update(id, updateDto);
    }

    @DeleteMapping("test/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable UUID id) {
        testService.delete(id);
    }
}
