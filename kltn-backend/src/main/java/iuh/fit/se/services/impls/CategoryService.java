package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.responses.CategoryResponse;
import iuh.fit.se.entities.Category;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.CategoryMapper;
import iuh.fit.se.repositories.CategoryRepository;
import iuh.fit.se.services.interfaces.ICategoryService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService implements ICategoryService {

  CategoryRepository categoryRepository;
  CategoryMapper categoryMapper;

  @Override
  @Transactional
  public CategoryResponse createCategory(String name, String description, Long parentId) {
    log.info("Creating category with name: {} and parentId: {}", name, parentId);

    Category parentCategory = null;
    if (parentId != null) {
      parentCategory =
          categoryRepository
              .findById(parentId)
              .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    Category category =
        Category.builder().name(name).description(description).category(parentCategory).build();

    Category savedCategory = categoryRepository.save(category);
    log.info("Category created successfully with ID: {}", savedCategory.getId());

    return categoryMapper.toCategoryResponse(savedCategory);
  }

  @Override
  @Transactional
  public CategoryResponse updateCategory(Long id, String name, String description, Long parentId) {
    log.info("Updating category with ID: {}", id);

    Category category =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

    // Prevent circular reference
    if (parentId != null && parentId.equals(id)) {
      throw new AppException(ErrorCode.INVALID_PARENT_CATEGORY);
    }

    Category parentCategory = null;
    if (parentId != null) {
      parentCategory =
          categoryRepository
              .findById(parentId)
              .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    category.setName(name);
    category.setDescription(description);
    category.setCategory(parentCategory);

    Category savedCategory = categoryRepository.save(category);
    log.info("Category updated successfully with ID: {}", savedCategory.getId());

    return categoryMapper.toCategoryResponse(savedCategory);
  }

  @Override
  @Transactional
  public void deleteCategory(Long id) {
    log.info("Deleting category with ID: {}", id);

    if (!categoryRepository.existsById(id)) {
      throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
    }

    // Check if category has subcategories
    List<Category> subCategories = categoryRepository.findByCategoryId(id);
    if (!subCategories.isEmpty()) {
      throw new AppException(ErrorCode.CATEGORY_HAS_SUBCATEGORIES);
    }

    categoryRepository.deleteById(id);
    log.info("Category deleted successfully with ID: {}", id);
  }

  @Override
  public CategoryResponse getCategoryById(Long id) {
    log.info("Getting category with ID: {}", id);

    Category category =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

    return categoryMapper.toCategoryResponse(category);
  }

  @Override
  public Page<CategoryResponse> getAllCategories(Pageable pageable) {
    log.info("Getting all categories with pagination");

    Page<Category> categories = categoryRepository.findAll(pageable);
    return categories.map(categoryMapper::toCategoryResponse);
  }

  @Override
  public List<CategoryResponse> getAllCategoriesWithoutPaging() {
    log.info("Getting all categories without pagination");

    List<Category> categories = categoryRepository.findAll();
    return categories.stream().map(categoryMapper::toCategoryResponse).toList();
  }

  @Override
  public List<CategoryResponse> getSubCategories(Long parentId) {
    log.info("Getting subcategories for parent ID: {}", parentId);

    List<Category> subCategories = categoryRepository.findByCategoryId(parentId);
    return subCategories.stream().map(categoryMapper::toCategoryResponse).toList();
  }

  @Override
  public List<CategoryResponse> getRootCategories() {
    log.info("Getting root categories");

    List<Category> rootCategories = categoryRepository.findByCategoryIsNull();
    return rootCategories.stream().map(categoryMapper::toCategoryResponse).toList();
  }
}
