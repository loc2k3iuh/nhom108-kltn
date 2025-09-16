package iuh.fit.se.repositories;

import iuh.fit.se.entities.User;
import iuh.fit.se.enums.UserStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  List<User> findByStatus(UserStatus status);

  Optional<User> findByPhoneNumber(String phoneNumber);
}
