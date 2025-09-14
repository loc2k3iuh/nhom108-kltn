package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.requests.UpdatePermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.services.interfaces.IPermissionService;
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
@RequestMapping("${api.prefix}/permissions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
  IPermissionService iPermissionService;

  @PostMapping("")
  public APIResponse<PermissionResponse> createPermission(
      @Valid @RequestBody PermissionRequest permissionRequest) {
    return APIResponse.<PermissionResponse>builder()
        .result(iPermissionService.createPermission(permissionRequest))
        .message("Permission created successfully !")
        .build();
  }

  @GetMapping("")
  public APIResponse<List<PermissionResponse>> getAllPermissions() {
    return APIResponse.<List<PermissionResponse>>builder()
        .result(iPermissionService.getAllPermissions())
        .message("Permissions retrieved successfully !")
        .build();
  }

  @DeleteMapping("/{name}")
  public APIResponse<Boolean> deletePermission(@PathVariable String name) {
    return APIResponse.<Boolean>builder()
        .result(iPermissionService.deletePermission(name))
        .message("Permission deleted successfully !")
        .build();
  }

  @PutMapping("/{name}")
  public APIResponse<PermissionResponse> updatePermission(
      @PathVariable String name,
      @Valid @RequestBody UpdatePermissionRequest updatePermissionRequest) {
    return APIResponse.<PermissionResponse>builder()
        .result(iPermissionService.updatePermission(name, updatePermissionRequest))
        .message("Permission updated successfully !")
        .build();
  }
}
