package ru.sberhack2025.telegrambot.services.event;

import java.util.List;

public interface EventService {

    List<EventResponseDto> getUserEvents(Long userId);

}
