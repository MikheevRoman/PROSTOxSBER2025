package ru.sberhack2025.telegrambot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.meta.generics.TelegramClient;

@Configuration
@PropertySource("application.properties")
public class BotConfig {

    @Value("${bot.token}")
    private String botToken;

    @Bean
    public String botToken() {
        return this.botToken;
    }

    @Bean
    public TelegramClient telegramClient() {
        return new OkHttpTelegramClient(this.botToken);
    }

}
