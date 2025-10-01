package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.responses.PreLoginResponse;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

  User toUserEntity(RegisterUserRequest dto);

  UserResponse toUserResponse(User user);

  PreLoginResponse toPreLoginResponse(User user);
}
