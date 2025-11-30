package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductVariantResponse;
import iuh.fit.se.entities.ProductVariant;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)")
@Component
public class ProductVariantMapperImpl implements ProductVariantMapper {

  @Autowired private ColorMapper colorMapper;
  @Autowired private SizeMapper sizeMapper;

  @Override
  public ProductVariantResponse toProductVariantResponse(ProductVariant productVariant) {
    if (productVariant == null) {
      return null;
    }

    ProductVariantResponse.ProductVariantResponseBuilder productVariantResponse =
        ProductVariantResponse.builder();

    productVariantResponse.id(productVariant.getId());
    productVariantResponse.sku(productVariant.getSku());
    productVariantResponse.price(productVariant.getPrice());
    productVariantResponse.stockQuantity(productVariant.getStockQuantity());
    productVariantResponse.material(productVariant.getMaterial());
    productVariantResponse.imageUrl(productVariant.getImageUrl());
    productVariantResponse.size(sizeMapper.toSizeResponse(productVariant.getSize()));
    productVariantResponse.color(colorMapper.toColorResponse(productVariant.getColor()));

    return productVariantResponse.build();
  }
}
