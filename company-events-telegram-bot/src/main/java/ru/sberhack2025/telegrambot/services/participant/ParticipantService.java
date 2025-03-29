package ru.sberhack2025.telegrambot.services.participant;

import java.util.UUID;

public interface ParticipantService {

    ParticipantResponseDto createParticipant(Long userId, String name, String refLink);

    ParticipantResponseDto getEventParticipant(UUID eventId, Long userId);

}
