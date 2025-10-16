package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateProductRequest;
import iuh.fit.se.dtos.requests.UpdateProductRequest;
import iuh.fit.se.dtos.responses.ProductResponse;
import iuh.fit.se.enums.ProductStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
  ProductResponse createProduct(CreateProductRequest request);

  ProductResponse updateProduct(Long id, UpdateProductRequest request);

  void deleteProduct(Long id);

  ProductResponse getProductById(Long id);

  Page<ProductResponse> getAllProducts(Pageable pageable);

  Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable);

  Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

  Page<ProductResponse> getProductsByBrand(Long brandId, Pageable pageable);

  Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

  Page<ProductResponse> getProductsByPriceRange(
      Double minPrice, Double maxPrice, Pageable pageable);

  List<ProductResponse> getLatestProducts(int limit);

  Page<ProductResponse> getAvailableProducts(Pageable pageable);

  void updateProductStatus(Long id, ProductStatus status);
}
