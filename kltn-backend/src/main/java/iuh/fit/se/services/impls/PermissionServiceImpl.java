package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.requests.UpdatePermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.entities.Permission;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.PermissionMapper;
import iuh.fit.se.repositories.PermissionRepository;
import iuh.fit.se.services.interfaces.IPermissionService;
import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl implements IPermissionService {

  PermissionRepository permissionRepository;
  PermissionMapper permissionMapper;

  @Override
  public PermissionResponse createPermission(PermissionRequest permissionRequest) {
    if (permissionRepository.findByName(permissionRequest.getName()).isPresent()) {
      throw new AppException(ErrorCode.PERMISSION_ALREADY_EXIST);
    }
    return permissionMapper.toPermissionResponse(
        permissionRepository.save(permissionMapper.toPermissionEntity(permissionRequest)));
  }

  @Override
  public List<PermissionResponse> getAllPermissions() {
    return permissionMapper.toResponseList(permissionRepository.findAll());
  }

  @Override
  public boolean deletePermission(String name) {
    Permission permission =
        permissionRepository
            .findByName(name)
            .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
    permissionRepository.delete(permission);
    return true;
  }

  @Override
  public PermissionResponse updatePermission(
      String name, UpdatePermissionRequest updatePermissionRequest) {
    Permission permission =
        permissionRepository
            .findByName(name)
            .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
    Optional.ofNullable(updatePermissionRequest.getDescription())
        .filter(pers -> !pers.isBlank())
        .ifPresent(permission::setDescription);
    return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
  }
}
