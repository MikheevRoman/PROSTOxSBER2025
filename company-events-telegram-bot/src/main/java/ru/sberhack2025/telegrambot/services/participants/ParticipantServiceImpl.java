package ru.sberhack2025.telegrambot.services.participants;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
public class ParticipantServiceImpl implements ParticipantService {

    private final WebClient participantApiClient;

    @Autowired
    public ParticipantServiceImpl(WebClient participantApiClient) {
        this.participantApiClient = participantApiClient;
    }

    @Override
    public ParticipantResponseDto createParticipant(Long userId, String name, String refLink) {
        CreateParticipantDto createParticipantDto = new CreateParticipantDto(userId, name, refLink);

        ResponseEntity<ParticipantResponseDto> response = participantApiClient
                .post()
                .uri("/participants")
                .bodyValue(createParticipantDto)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(ParticipantResponseDto.class)
                .block();

        assert response != null;
        log.info("[{}] user registered", createParticipantDto.getTgUserId());
        return response.getBody();
    }

}
