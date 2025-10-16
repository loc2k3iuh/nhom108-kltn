package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductImageResponse;
import iuh.fit.se.entities.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductImageMapper {
  ProductImageResponse toProductImageResponse(ProductImage productImage);
}
