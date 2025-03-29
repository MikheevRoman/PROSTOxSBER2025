package ru.sberhack2025.telegrambot.services.participants;

public interface ParticipantService {

    ParticipantResponseDto createParticipant(Long userId, String name, String refLink);

}
