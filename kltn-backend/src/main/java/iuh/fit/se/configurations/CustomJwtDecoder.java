package iuh.fit.se.configurations;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.services.interfaces.IAuthenticationService;
import java.text.ParseException;
import java.util.Objects;
import javax.crypto.spec.SecretKeySpec;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {

  @NonFinal
  @Value("${jwt.signer.key}")
  String signerKey;

  IAuthenticationService iAuthenticationService;

  @NonFinal NimbusJwtDecoder nimbusJwtDecoder = null;

  @Override
  public Jwt decode(String token) throws JwtException {
    try {
      boolean response =
          iAuthenticationService.introspect(IntrospectRequest.builder().token(token).build());
      if (!response) throw new AppException(ErrorCode.TOKEN_INVALID);
    } catch (JOSEException | ParseException e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
    if (Objects.isNull(nimbusJwtDecoder)) {
      SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
      nimbusJwtDecoder =
          NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
    }
    return nimbusJwtDecoder.decode(token);
  }
}
