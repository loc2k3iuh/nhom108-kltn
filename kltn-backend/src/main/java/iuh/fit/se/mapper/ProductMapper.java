package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.dtos.responses.ProductResponse;
import iuh.fit.se.entities.Product;

public interface ProductMapper {

  ProductResponse toProductResponse(Product product);

  ProductDetailResponse toProductDetailResponse(Product product);
}
