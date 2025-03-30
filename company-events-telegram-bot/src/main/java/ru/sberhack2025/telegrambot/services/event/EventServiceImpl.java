package ru.sberhack2025.telegrambot.services.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;

@Service
@Slf4j
public class EventServiceImpl implements EventService {

    private final WebClient eventClient;

    @Autowired
    public EventServiceImpl(WebClient eventClient) {
        this.eventClient = eventClient;
    }

    @Override
    public List<EventResponseDto> getUserEvents(Long userId) {
        try {
            ResponseEntity<List<EventResponseDto>> response = eventClient
                    .get()
                    .uri("/users/" + userId + "/events")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntityList(EventResponseDto.class)
                    .block();

            assert response != null;
            return response.getBody();
        } catch (WebClientResponseException.InternalServerError e) {
            log.error("internal server error: {}", e.getMessage());
            return null;
        } catch (WebClientResponseException e) {
            log.warn("{}", e.getMessage());
            return null;
        }
    }
}
