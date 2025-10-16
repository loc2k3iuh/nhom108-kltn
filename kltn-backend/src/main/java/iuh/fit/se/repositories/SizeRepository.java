package iuh.fit.se.repositories;

import iuh.fit.se.entities.Size;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

  Optional<Size> findByName(String name);

  @Query("SELECT s FROM Size s WHERE s.name LIKE %:keyword%")
  List<Size> findByNameContaining(@Param("keyword") String keyword);

  boolean existsByName(String name);
}
