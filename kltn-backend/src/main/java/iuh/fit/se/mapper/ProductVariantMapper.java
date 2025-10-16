package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductVariantResponse;
import iuh.fit.se.entities.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ColorMapper.class, SizeMapper.class})
public interface ProductVariantMapper {
  ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);
}
