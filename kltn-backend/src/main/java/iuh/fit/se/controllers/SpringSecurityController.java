package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/security")
public class SpringSecurityController {

  @GetMapping("")
  public APIResponse<Map<String, Object>> getAuthentication() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    Map<String, Object> result = new HashMap<>();
    result.put("principal", authentication.getPrincipal());
    result.put("authorities", authentication.getAuthorities());
    result.put("details", authentication.getDetails());
    result.put("name", authentication.getName());

    return APIResponse.<Map<String, Object>>builder()
        .result(result)
        .message("Authentication retrieved successfully !")
        .build();
  }
}
