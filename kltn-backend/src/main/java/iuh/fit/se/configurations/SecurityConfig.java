package iuh.fit.se.configurations;


import java.util.Arrays;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
//		http://localhost:9090/vuvisa/swagger-ui/index.html xem api bằng UI.

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {

  CustomJwtDecoder customJwtDecoder;

  String[] PUBLIC_POST_ENDPOINTS = {
          "/api/v1/auth/login",
          "/api/v1/auth/login-temporarily",
          "/api/v1/register",
          "/api/v1/auth/logout"
  };

  String[] PUBLIC_GET_ENDPOINTS = {};

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.csrf(AbstractHttpConfigurer::disable);

    httpSecurity.authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS)
            .permitAll()
            .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS)
            .permitAll()
            .requestMatchers("/ws/**","/swagger-ui/**", "/v3/api-docs/**")
            .permitAll()
            .anyRequest()
            .authenticated());

    httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(
            jwt -> jwt.decoder(customJwtDecoder).jwtAuthenticationConverter(jwtAuthenticationConverter())
    ).authenticationEntryPoint(new JwtAuthenticationEntryPoint())
    );

    httpSecurity.cors(cors -> {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration.setAllowedOrigins(List.of("*"));
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(List.of("*"));
      configuration.setExposedHeaders(List.of("x-auth-token"));
      configuration.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      cors.configurationSource(source);
    });
    return httpSecurity.build();
  }

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter(){
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }
}
