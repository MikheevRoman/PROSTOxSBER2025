package ru.sberhack2025.companyevents.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * @author Andrey Kurnosov
 */
public class UserUpdateDto {

    @Schema(description = "User's name", example = "Маша")
    String name;

}
