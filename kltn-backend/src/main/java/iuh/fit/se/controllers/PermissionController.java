package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.PermissionRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.services.impls.PermissionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/permissions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("")
    public APIResponse<PermissionResponse> createPermission(@Valid @RequestBody PermissionRequest permissionRequest){
        return APIResponse.<PermissionResponse>builder().result(permissionService.create(permissionRequest)).message("Permission created successfully !").build();
    }

    @GetMapping("")
    public APIResponse<List<PermissionResponse>> getAllPermissions(){
        return APIResponse.<List<PermissionResponse>>builder().result(permissionService.getAllPermissions()).message("Permissions retrieved successfully !").build();
    }

    @DeleteMapping("/{name}")
    public APIResponse<Boolean> deletePermission(@PathVariable String name){
        return APIResponse.<Boolean>builder().result(permissionService.deletePermission(name)).message("Permission deleted successfully !").build();
    }
}
