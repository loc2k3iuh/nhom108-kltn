package iuh.fit.se.repositories;

import iuh.fit.se.entities.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

  Optional<Cart> findByUserId(Long userId);

  @Query("SELECT c FROM Cart c WHERE c.user.id = :userId")
  Optional<Cart> findCartByUserId(@Param("userId") Long userId);

  boolean existsByUserId(Long userId);
}
