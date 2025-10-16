package iuh.fit.se.repositories;

import iuh.fit.se.entities.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  List<Category> findByCategoryId(Long parentId);

  List<Category> findByCategoryIsNull();

  boolean existsByName(String name);
}
