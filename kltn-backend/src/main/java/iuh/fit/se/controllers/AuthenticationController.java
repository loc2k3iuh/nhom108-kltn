package iuh.fit.se.controllers;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.dtos.requests.LoginRequest;
import iuh.fit.se.dtos.requests.LogoutRequest;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.services.interfaces.IAuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    IAuthenticationService iAuthenticationService;


    @PostMapping("/login")
    public APIResponse<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) throws JOSEException {
        return APIResponse.<LoginResponse>builder()
                .result(iAuthenticationService.authenticate(loginRequest, httpServletResponse))
                .message("Log in successfully !")
                .build();
    }

    @GetMapping("/introspect")
    public APIResponse<Boolean> introspectToken(@Valid @RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        return APIResponse.<Boolean>builder()
                .result(iAuthenticationService.introspect(introspectRequest))
                .message("Token valid !")
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<APIResponse<Void>> logout(@Valid @RequestBody LogoutRequest logoutRequest, @CookieValue(name = "refresh_token", required = false) String refreshToken) throws ParseException, JOSEException {
        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        iAuthenticationService.logout(logoutRequest, refreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(APIResponse.<Void>builder()
                        .message("Logged out successfully !")
                        .build());
    }


}
