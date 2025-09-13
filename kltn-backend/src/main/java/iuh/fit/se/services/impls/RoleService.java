package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.requests.UpdateRoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.services.interfaces.IRoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService implements IRoleService {
    @Override
    public RoleResponse create(RoleRequest obj) {
        return null;
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return List.of();
    }

    @Override
    public void deleteRole(String name) {

    }

    @Override
    public RoleResponse updateRole(String name, UpdateRoleRequest obj) {
        return null;
    }
}
