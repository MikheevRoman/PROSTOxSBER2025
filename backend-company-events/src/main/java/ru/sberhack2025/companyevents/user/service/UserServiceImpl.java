package ru.sberhack2025.companyevents.user.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.core.service.DefaultServiceImpl;
import ru.sberhack2025.companyevents.user.dto.UserCreateDto;
import ru.sberhack2025.companyevents.user.dto.UserUpdateDto;
import ru.sberhack2025.companyevents.user.dto.UserView;
import ru.sberhack2025.companyevents.user.mapper.UserMapper;
import ru.sberhack2025.companyevents.user.model.User;
import ru.sberhack2025.companyevents.user.repository.UserRepository;

/**
 * @author Andrey Kurnosov
 */
@Service
@Slf4j
public class UserServiceImpl extends DefaultServiceImpl<User, UserCreateDto, UserUpdateDto, UserView, UserRepository, UserMapper> {

    public UserServiceImpl(@Qualifier("userRepository") UserRepository userRepository, UserMapper userMapper) {
        super(userRepository, userMapper);
    }

    @Transactional
    public UserView updateByTgUserId(Long tgUserId, UserUpdateDto updateDto) {
        User user = repository.find(tgUserId);
        return mapper.toView(
                mapper.update(updateDto, user)
        );
    }

    @Transactional
    public UserView getByTgUserId(Long tgUserId) {
        return mapper.toView(repository.find(tgUserId));
    }

    @Override
    protected Boolean checkIfExists(UserCreateDto createDto) {
        return repository.checkIfExists(createDto.getTgUserId());
    }


}
