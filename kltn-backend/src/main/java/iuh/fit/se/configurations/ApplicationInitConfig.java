// package iuh.fit.se.configurations;
//
// import iuh.fit.se.entities.Role;
// import iuh.fit.se.entities.User;
// import iuh.fit.se.enums.RoleType;
// import iuh.fit.se.exceptions.AppException;
// import iuh.fit.se.exceptions.ErrorCode;
// import iuh.fit.se.repositories.RoleRepository;
// import iuh.fit.se.repositories.UserRepository;
// import java.util.Date;
// import java.util.HashSet;
// import java.util.Optional;
// import lombok.AccessLevel;
// import lombok.RequiredArgsConstructor;
// import lombok.experimental.FieldDefaults;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.boot.ApplicationRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;
//
// @Slf4j
// @Configuration
// @RequiredArgsConstructor
// @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
// public class ApplicationInitConfig {
//
//  PasswordEncoder passwordEncoder;
//
//  @Bean
//  ApplicationRunner applicationRunner(
//      UserRepository userRepository, RoleRepository roleRepository) {
//    HashSet<Role> roles = new HashSet<>();
//    Role defaultRole =
//        roleRepository
//            .findByName(RoleType.valueOf("ADMIN"))
//            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
//    roles.add(defaultRole);
//
//    return args -> {
//      Optional<User> existUser = userRepository.findByUsername("admin");
//      if (existUser.isEmpty()) {
//        userRepository.save(
//            User.builder()
//                .username("admin")
//                .password(passwordEncoder.encode("admin"))
//                .createdDate(new Date())
//                .email("nguyentanloc13c9@gmail.com")
//                .isActive(true)
//                .enabled(true)
//                .roles(roles)
//                .build());
//      } else {
//        if (passwordEncoder.matches("admin", existUser.get().getPassword())) {
//          log.warn("User admin created with default password: admin, please change it !!!");
//        }
//      }
//    };
//  }
// }

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

    return args -> {
      // First, create all roles if they don't exist

      createRoleIfNotExists(roleRepository, RoleType.ADMIN, "Administrator role");
      createRoleIfNotExists(roleRepository, RoleType.STAFF, "Staff role");
      createRoleIfNotExists(roleRepository, RoleType.CUSTOMER, "Customer role");

      // Then create admin user
      HashSet<Role> roles = new HashSet<>();
      Role adminRole =
          roleRepository
              .findByName(RoleType.ADMIN)
              .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
      roles.add(adminRole);

      Optional<User> existUser = userRepository.findByUsername("admin");
      if (existUser.isEmpty()) {
        userRepository.save(
            User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .createdDate(new Date())
                .email("danghiemnguyen@gmail.com")
                .isActive(true)
                .enabled(true)
                .roles(roles)
                .build());
        log.info("Created admin user with default password: admin");
      } else {
        if (passwordEncoder.matches("admin", existUser.get().getPassword())) {
          log.warn("User admin created with default password: admin, please change it !!!");
        }
      }

      // Then create user
      HashSet<Role> roles2 = new HashSet<>();
      Role adminRole2 =
          roleRepository
              .findByName(RoleType.CUSTOMER)
              .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
      roles2.add(adminRole2);

      Optional<User> existUser2 = userRepository.findByUsername("danguym");
      if (existUser.isEmpty()) {
        userRepository.save(
            User.builder()
                .username("danguym")
                .password(passwordEncoder.encode("danguym"))
                .createdDate(new Date())
                .email("danguym.12.12.2k3@gmail.com")
                .isActive(true)
                .enabled(true)
                .roles(roles2)
                .build());
        log.info("Created danguym user with default password: danguym");
      } else {
        if (passwordEncoder.matches("danguym", existUser.get().getPassword())) {
          log.warn("User danguym created with default password: danguym, please change it !!!");
        }
      }
    };
  }

  private void createRoleIfNotExists(
      RoleRepository roleRepository, RoleType roleType, String description) {
    if (!roleRepository.existsByName(roleType)) {
      roleRepository.save(Role.builder().name(roleType).description(description).build());
      log.info("Created role: {}", roleType.name());
    }
  }
}
