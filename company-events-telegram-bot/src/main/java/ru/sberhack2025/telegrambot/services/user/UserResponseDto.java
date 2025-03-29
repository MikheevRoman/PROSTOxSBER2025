package ru.sberhack2025.telegrambot.services.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserResponseDto {

    private UUID id;

    private Long tgUserId;

    private String name;

    private LocalDateTime createdAt;

    private String error;

    private String description;

}