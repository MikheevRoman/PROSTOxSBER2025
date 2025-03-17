package ru.sberhack2025.companyevents.test.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.test.dto.TestCreateDto;
import ru.sberhack2025.companyevents.test.dto.TestResponseDto;
import ru.sberhack2025.companyevents.test.dto.TestUpdateDto;
import ru.sberhack2025.companyevents.test.model.Test;

import java.util.List;

/**
 * @author Andrey Kurnosov
 */
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TestMapper {

    Test toEntity(TestCreateDto createDto);
    TestResponseDto toResponseDto(Test test);
    Test updateFromDto(TestUpdateDto updateDto,@MappingTarget Test test);
    List<TestResponseDto> toResponseDtoList(List<Test> testList);
}