package iuh.fit.se.services.interfaces;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.entities.User;
import java.text.ParseException;

public interface IJwtService {
  String generateToken(User user) throws JOSEException;

  String buildScope(User user);

  SignedJWT verifyToken(String token) throws JOSEException, ParseException;
}
