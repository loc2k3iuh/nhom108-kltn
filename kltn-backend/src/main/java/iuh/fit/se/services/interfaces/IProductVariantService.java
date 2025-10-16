package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateProductVariantRequest;
import iuh.fit.se.dtos.requests.UpdateProductVariantRequest;
import iuh.fit.se.dtos.responses.ProductVariantResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductVariantService {
  ProductVariantResponse createProductVariant(CreateProductVariantRequest request);

  ProductVariantResponse updateProductVariant(Long id, UpdateProductVariantRequest request);

  void deleteProductVariant(Long id);

  ProductVariantResponse getProductVariantById(Long id);

  List<ProductVariantResponse> getProductVariantsByProductId(Long productId);

  Page<ProductVariantResponse> getAllProductVariants(Pageable pageable);

  void updateStock(Long id, Integer quantity);

  List<ProductVariantResponse> getAvailableVariantsByProduct(Long productId);
}
