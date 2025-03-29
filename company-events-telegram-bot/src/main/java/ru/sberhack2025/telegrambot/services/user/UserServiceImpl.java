package ru.sberhack2025.telegrambot.services.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    
    private final WebClient companyEventsApiClient;
    
    public UserServiceImpl(WebClient companyEventsApiClient) {
        this.companyEventsApiClient = companyEventsApiClient;
    }

    @Override
    public UserResponseDto createUser(Long userId, String name) {
        CreateUserDto createUserDto = new CreateUserDto(userId, name);

        ResponseEntity<UserResponseDto> response = companyEventsApiClient
                .post()
                .uri("/users")
                .bodyValue(createUserDto)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(UserResponseDto.class)
                .block();

        assert response != null;
        log.info("[{}] user registered", createUserDto.getTgUserId());
        return response.getBody();
    }

}
