package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;

import java.util.List;

public interface IPermissionService {
    PermissionResponse create(PermissionRequest obj);

    List<PermissionResponse> getAllPermissions();

    boolean deletePermission(String name);
}
