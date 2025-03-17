package ru.sberhack2025.companyevents.test.service;

import ru.sberhack2025.companyevents.test.dto.TestCreateDto;
import ru.sberhack2025.companyevents.test.dto.TestResponseDto;
import ru.sberhack2025.companyevents.test.dto.TestUpdateDto;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public interface TestService {

    TestResponseDto create(TestCreateDto createDto);

    TestResponseDto update(UUID id, TestUpdateDto updateDto);

    TestResponseDto getById(UUID id);

    List<TestResponseDto> getAll();

    void delete(UUID id);
}
