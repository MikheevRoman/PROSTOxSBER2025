package ru.sberhack2025.companyevents.test.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCreateDto {


    @Schema(description = "Test name", example = "test-name")
    @NotNull(message = "Name cannot be null")
    String name;
}
