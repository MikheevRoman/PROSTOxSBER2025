package ru.sberhack2025.telegrambot.services.procurements;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ProcurementsServiceImpl implements ProcurementsService {

    private final WebClient procurementsClient;

    @Autowired
    public ProcurementsServiceImpl(WebClient procurementsClient) {
        this.procurementsClient = procurementsClient;
    }

    @Override
    public List<ProcurementsResponseDto> getContributedProcurements(UUID participantId) {
        try {
            ResponseEntity<List<ProcurementsResponseDto>> response = procurementsClient
                    .get()
                    .uri("/participants/" + participantId + "/procurements/contributed")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntityList(ProcurementsResponseDto.class)
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

    @Override
    public List<ProcurementsResponseDto> getResponsibleProcurements(UUID participantId) {
        try {
            ResponseEntity<List<ProcurementsResponseDto>> response = procurementsClient
                    .get()
                    .uri("/participants/" + participantId + "/procurements/responsible")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntityList(ProcurementsResponseDto.class)
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
