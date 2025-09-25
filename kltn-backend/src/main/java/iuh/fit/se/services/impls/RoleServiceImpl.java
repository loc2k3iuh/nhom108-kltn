package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.requests.UpdateRoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.entities.Role;
import iuh.fit.se.enums.RoleType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.RoleMapper;
import iuh.fit.se.repositories.PermissionRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.services.interfaces.IRoleService;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements IRoleService {

  PermissionRepository permissionRepository;
  RoleRepository roleRepository;
  RoleMapper roleMapper;

  @Override
  public RoleResponse create(RoleRequest roleRequest) {
    if (roleRepository.findByName(RoleType.valueOf(roleRequest.getName())).isPresent()) {
      throw new AppException(ErrorCode.ROLE_ALREADY_EXIST);
    }
    return roleMapper.toRoleResponse(
        roleRepository.save(roleMapper.toRoleEntity(roleRequest, permissionRepository)));
  }

  @Override
  @PreAuthorize("hasAuthority('APPROVE_POS')")
  public List<RoleResponse> getAllRoles() {
    return roleMapper.toListRoleResponse(roleRepository.findAll());
  }

  @Override
  public boolean deleteRole(String name) {
    Role role =
        roleRepository
            .findByName(RoleType.valueOf(name))
            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
    roleRepository.delete(role);
    return true;
  }

  @Override
  public RoleResponse updateRole(String name, UpdateRoleRequest updateRoleRequest) {
    Role role =
        roleRepository
            .findByName(RoleType.valueOf(name))
            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

    Optional.ofNullable(updateRoleRequest.getDescription())
        .filter(desc -> !desc.isBlank())
        .ifPresent(role::setDescription);

    Optional.ofNullable(updateRoleRequest.getPermissions())
        .filter(perms -> !perms.isEmpty())
        .ifPresent(
            perms -> role.setPermissions(new HashSet<>(permissionRepository.findAllById(perms))));
    log.info(String.valueOf(role));
    return roleMapper.toRoleResponse(roleRepository.save(role));
  }
}
