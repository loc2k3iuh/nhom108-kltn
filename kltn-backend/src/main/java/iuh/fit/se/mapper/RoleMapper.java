package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.entities.Role;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {

    Role toRoleEntity(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
