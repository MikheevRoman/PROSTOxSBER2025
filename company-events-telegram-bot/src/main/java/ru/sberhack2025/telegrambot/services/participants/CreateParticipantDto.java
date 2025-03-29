package ru.sberhack2025.telegrambot.services.participants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateParticipantDto {

    private Long tgUserId;

    private String name;

    private String eventRefCode;
}
