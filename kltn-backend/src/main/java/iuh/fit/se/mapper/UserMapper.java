package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUserEntity(RegisterUserRequest dto);

    UserResponse toUserResponse(User user);
}
