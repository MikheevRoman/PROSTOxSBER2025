package ru.sberhack2025.companyevents.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.sberhack2025.companyevents.user.dto.UserCreateDto;
import ru.sberhack2025.companyevents.user.dto.UserView;
import ru.sberhack2025.companyevents.user.dto.UserUpdateDto;
import ru.sberhack2025.companyevents.user.service.UserServiceImpl;

import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/company-events")
@Tag(name = "User controller", description = "Endpoints for users")
public class UserController {

    private final UserServiceImpl userService;

    @Operation(
            summary = "Создать юзера",
            description = ""
    )
    @PostMapping("users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserView create(@Validated @RequestBody final UserCreateDto createDto) {
        return userService.create(createDto);
    }


    @Operation(
            summary = "Получить всех юзеров",
            description = ""
    )
    @GetMapping("users")
    public List<UserView> getAll() {
        return userService.getAll();
    }


    @Operation(
            summary = "Получить юзера по tgUserId",
            description = ""
    )
    @GetMapping("users/{id}")
    public UserView getById(@PathVariable Long id) {
        return userService.getByTgUserId(id);
    }


    @Operation(
            summary = "Обновить юзера по tgUserId",
            description = "Возвращает обновленного юзера"
    )
    @PatchMapping("users/{id}")
    public UserView update(@PathVariable Long id, @Validated @RequestBody final UserUpdateDto updateDto) {
        return userService.updateByTgUserId(id, updateDto);
    }

    @Operation(
            summary = "Удалить юзера по id",
            description = "Ничего не возвращает, только код 204"
    )
    @DeleteMapping("users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable UUID id) {
        userService.delete(id);
    }
}
