package ru.sberhack2025.telegrambot.services.user;

public interface UserService {

    UserResponseDto createUser(Long userId, String name);

}
