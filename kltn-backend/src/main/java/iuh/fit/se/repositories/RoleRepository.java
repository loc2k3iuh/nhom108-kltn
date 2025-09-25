package iuh.fit.se.repositories;

import iuh.fit.se.entities.Role;
import iuh.fit.se.enums.RoleType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
  Optional<Role> findByName(RoleType name);
}
