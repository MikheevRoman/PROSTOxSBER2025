package ru.sberhack2025.telegrambot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class ConnectionConfig {

    @Value("${company-events.api.url}")
    private String companyEventsApiUrl;

    @Bean
    public WebClient userServiceClient() {
        return WebClient.create(companyEventsApiUrl);
    }

}
