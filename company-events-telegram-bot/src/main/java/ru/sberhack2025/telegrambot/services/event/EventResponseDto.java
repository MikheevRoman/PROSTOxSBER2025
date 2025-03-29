package ru.sberhack2025.telegrambot.services.event;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class EventResponseDto {

    private UUID id;

    private String name;

    private LocalDateTime date;

    private String place;

    private Long budget;

    private String comment;

}
