package ru.sberhack2025.companyevents.test.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestUpdateDto {

    @Schema(description = "Test id")
    UUID id;

    @Schema(description = "Test name", example = "test-name")
    String name;
}
