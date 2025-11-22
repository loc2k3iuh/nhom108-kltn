package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.responses.CategoryResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICategoryService {
  CategoryResponse createCategory(String name, String description, Long parentId);

  CategoryResponse updateCategory(Long id, String name, String description, Long parentId);

  void deleteCategory(Long id);

  CategoryResponse getCategoryById(Long id);

  Page<CategoryResponse> getAllCategories(Pageable pageable);

  List<CategoryResponse> getAllCategoriesWithoutPaging();

  List<CategoryResponse> getSubCategories(Long parentId);

  List<CategoryResponse> getRootCategories();
}
