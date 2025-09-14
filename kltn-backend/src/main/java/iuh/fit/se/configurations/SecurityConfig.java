package iuh.fit.se.configurations;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

//		http://localhost:9090/vuvisa/swagger-ui/index.html xem api bằng UI.

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SecurityConfig {

  final String[] PUBLIC_POST_ENDPOINTS = {};

  final String[] PUBLIC_GET_ENDPOINTS = {};

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.csrf(AbstractHttpConfigurer::disable);

    httpSecurity.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

    return httpSecurity.build();
  }
}
