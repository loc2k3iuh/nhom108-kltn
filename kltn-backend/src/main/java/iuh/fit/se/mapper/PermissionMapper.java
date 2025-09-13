package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.entities.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toPermissionEntity(PermissionRequest permissionRequest);

    PermissionResponse toPermissionResponse(Permission permission);

    List<PermissionResponse> toResponseList(List<Permission> permissions);
}
