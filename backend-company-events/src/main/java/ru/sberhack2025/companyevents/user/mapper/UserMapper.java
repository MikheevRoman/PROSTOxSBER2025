package ru.sberhack2025.companyevents.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.core.mapper.DefaultMapper;
import ru.sberhack2025.companyevents.user.dto.UserCreateDto;
import ru.sberhack2025.companyevents.user.dto.UserUpdateDto;
import ru.sberhack2025.companyevents.user.dto.UserView;
import ru.sberhack2025.companyevents.user.model.User;

/**
 * @author Andrey Kurnosov
 */
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper extends DefaultMapper<User, UserCreateDto, UserUpdateDto, UserView> {
}
