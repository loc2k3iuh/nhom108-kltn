package iuh.fit.se.repositories;

import iuh.fit.se.entities.Color;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {

  Optional<Color> findByName(String name);

  @Query("SELECT c FROM Color c WHERE c.name LIKE %:keyword%")
  List<Color> findByNameContaining(@Param("keyword") String keyword);

  boolean existsByName(String name);
}
