package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.CategoryResponse;
import iuh.fit.se.entities.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
  @Mapping(source = "category", target = "parentCategory")
  CategoryResponse toCategoryResponse(Category category);
}
