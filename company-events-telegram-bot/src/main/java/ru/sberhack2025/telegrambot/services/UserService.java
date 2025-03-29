package ru.sberhack2025.telegrambot.services;

public interface UserService {

    UserResponseDto createUser(Long userId, String name);

}
