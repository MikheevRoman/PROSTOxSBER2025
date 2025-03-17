package ru.sberhack2025.companyevents.test.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.common.error.exception.entity.EntityNotFoundException;
import ru.sberhack2025.companyevents.test.dto.TestCreateDto;
import ru.sberhack2025.companyevents.test.dto.TestResponseDto;
import ru.sberhack2025.companyevents.test.dto.TestUpdateDto;
import ru.sberhack2025.companyevents.test.mapper.TestMapper;
import ru.sberhack2025.companyevents.test.model.Test;
import ru.sberhack2025.companyevents.test.repository.TestRepository;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TestServiceImpl implements TestService {

    private final TestRepository testRepository;
    private final TestMapper testMapper;


    @Override
    @Transactional
    public TestResponseDto create(TestCreateDto createDto) {
        Test test = testMapper.toEntity(createDto);
        testRepository.save(test);
        log.info("New test created {}", test);
        return testMapper.toResponseDto(test);
    }

    @Override
    @Transactional
    public TestResponseDto update(UUID id, TestUpdateDto updateDto) {
        Test test = checkIfExistsAndGet(id);
        return testMapper.toResponseDto(
                testMapper.updateFromDto(updateDto, test)
        );
    }

    @Override
    public void delete(UUID id) {
        Test webmaster = checkIfExistsAndGet(id);
        testRepository.delete(webmaster);
        log.info("Test with id={} deleted", id);
    }

    @Override
    public TestResponseDto getById(UUID id) {
        return testMapper.toResponseDto(checkIfExistsAndGet(id));
    }

    @Override
    public List<TestResponseDto> getAll() {
        return testMapper.toResponseDtoList(testRepository.findAll());
    }


    private Test checkIfExistsAndGet(UUID id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Test.class, id));
    }

}
