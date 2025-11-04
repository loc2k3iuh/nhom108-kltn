package iuh.fit.se.configurations;

import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.enums.RoleType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

  PasswordEncoder passwordEncoder;

  @Bean
  ApplicationRunner applicationRunner(
      UserRepository userRepository, RoleRepository roleRepository) {
    HashSet<Role> roles = new HashSet<>();
    Role defaultRole =
        roleRepository
            .findByName(RoleType.valueOf("ADMIN"))
            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
    roles.add(defaultRole);

    return args -> {
      Optional<User> existUser = userRepository.findByUsername("admin");
      if (existUser.isEmpty()) {
        userRepository.save(
            User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .createdDate(new Date())
                .email("nguyentanloc13c9@gmail.com")
                .isActive(true)
                .enabled(true)
                .roles(roles)
                .build());
      } else {
        if (passwordEncoder.matches("admin", existUser.get().getPassword())) {
          log.warn("User admin created with default password: admin, please change it !!!");
        }
      }
    };
  }
}
