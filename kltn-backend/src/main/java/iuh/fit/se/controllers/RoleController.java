package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.requests.UpdateRoleRequest;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.services.interfaces.IRoleService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/roles")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

  IRoleService iRoleService;

  @PostMapping("")
  public APIResponse<RoleResponse> createRole(@Valid @RequestBody RoleRequest roleRequest) {
    return APIResponse.<RoleResponse>builder()
        .result(iRoleService.create(roleRequest))
        .message("Role created successfully !")
        .build();
  }

  @GetMapping("")
  public APIResponse<List<RoleResponse>> getAllRoles() {
    return APIResponse.<List<RoleResponse>>builder()
        .result(iRoleService.getAllRoles())
        .message("Roles retrieved successfully !")
        .build();
  }

  @DeleteMapping("/{name}")
  public APIResponse<Boolean> deleteRole(@PathVariable String name) {
    return APIResponse.<Boolean>builder()
        .result(iRoleService.deleteRole(name))
        .message("Role deleted successfully !")
        .build();
  }

  @PutMapping("/{name}")
  public APIResponse<RoleResponse> updateRole(
      @PathVariable String name, @Valid @RequestBody UpdateRoleRequest updateRoleRequest) {
    return APIResponse.<RoleResponse>builder()
        .result(iRoleService.updateRole(name, updateRoleRequest))
        .message("Role updated successfully !")
        .build();
  }
}
