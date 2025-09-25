package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.requests.UpdateRoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import java.util.List;

public interface IRoleService {
  RoleResponse create(RoleRequest obj);

  List<RoleResponse> getAllRoles();

  boolean deleteRole(String name);

  RoleResponse updateRole(String name, UpdateRoleRequest obj);
}
