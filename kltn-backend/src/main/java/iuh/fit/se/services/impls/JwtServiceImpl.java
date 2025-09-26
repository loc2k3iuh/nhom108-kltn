package iuh.fit.se.services.impls;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.InvalidatedTokenRepository;
import iuh.fit.se.services.interfaces.IJwtService;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtServiceImpl implements IJwtService {

  InvalidatedTokenRepository invalidatedTokenRepository;

  @NonFinal
  @Value("${jwt.signer.key}")
  protected String signerKey;

  @NonFinal
  @Value("${jwt.token.expiration-in-s}")
  protected int validTokenExpiration;

  @Override
  public String generateToken(User user) throws JOSEException {
    JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
    JWTClaimsSet jwtClaimsSet =
        new JWTClaimsSet.Builder()
            .subject(user.getUsername())
            .issuer("https://luther.com")
            .issueTime(new Date())
            .expirationTime(
                new Date(
                    Instant.now().plus(validTokenExpiration, ChronoUnit.SECONDS).toEpochMilli()))
            .jwtID(UUID.randomUUID().toString())
            .claim("scope", buildScope(user))
            .claim("userId", user.getId())
            .build();
    Payload payload = new Payload(jwtClaimsSet.toJSONObject());
    JWSObject jwsObject = new JWSObject(jwsHeader, payload);
    jwsObject.sign(new MACSigner(signerKey.getBytes()));
    return jwsObject.serialize();
  }

  @Override
  public String buildScope(User user) {
    StringJoiner stringJoiner = new StringJoiner(" ");
    if (!CollectionUtils.isEmpty(user.getRoles())) {
      user.getRoles().forEach(role -> stringJoiner.add("ROLE_" + role.getName().name()));
      Role firstRole = user.getRoles().stream().findFirst().orElse(null);
      if (firstRole != null && !CollectionUtils.isEmpty(firstRole.getPermissions())) {
        firstRole.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
      }
    }
    return stringJoiner.toString();
  }

  @Override
  public SignedJWT verifyToken(String token) {
    try {
      JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
      SignedJWT signedJWT = SignedJWT.parse(token);

      Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
      boolean verified = signedJWT.verify(verifier);

      if (!(verified && expiryTime.after(new Date()))) {
        throw new AppException(ErrorCode.UNAUTHENTICATED);
      }

      if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
        throw new AppException(ErrorCode.UNAUTHENTICATED);
      }
      return signedJWT;
    } catch (JOSEException | ParseException e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }
}
