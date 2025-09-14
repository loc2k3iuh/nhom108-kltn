package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.entities.Permission;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

  Permission toPermissionEntity(PermissionRequest permissionRequest);

  PermissionResponse toPermissionResponse(Permission permission);

  List<PermissionResponse> toResponseList(List<Permission> permissions);
}
