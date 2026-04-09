package souplesse_pilates.studio.souplesse_pilates.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.UserResponseDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    User toEntity(UserResponseDto userResponseDto);
}