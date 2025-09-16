package iuh.fit.se.services.interfaces;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.dtos.requests.LoginRequest;
import iuh.fit.se.dtos.responses.LoginResponse;

import java.text.ParseException;

public interface IAuthenticationService {

  LoginResponse authenticate(LoginRequest loginRequest) throws JOSEException;

  boolean introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException;
}
