package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.entities.Permission;
import iuh.fit.se.entities.Role;
import iuh.fit.se.enums.RoleType;
import iuh.fit.se.repositories.PermissionRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

  @Mapping(target = "permissions", source = "permissions")
  @Mapping(target = "name", source = "name")
  Role toRoleEntity(RoleRequest dto, @Context PermissionRepository permissionRepository);

  // Map String → RoleType
  default RoleType map(String roleName) {
    if (roleName == null) return null;
    return RoleType.valueOf(roleName.toUpperCase()); // tránh lỗi case sensitive
  }

  default Set<Permission> mapPermissions(Set<String> ids, @Context PermissionRepository repo) {
    return new HashSet<>(repo.findAllById(ids));
  }

  RoleResponse toRoleResponse(Role role);

  List<RoleResponse> toListRoleResponse(List<Role> roles);
}
