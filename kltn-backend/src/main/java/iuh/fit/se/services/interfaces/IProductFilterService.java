package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.ProductFilterRequest;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.dtos.responses.ProductStatisticsResponse;
import org.springframework.data.domain.Page;

public interface IProductFilterService {

    Page<ProductDetailResponse> filterProducts(ProductFilterRequest filterRequest);

    Page<ProductDetailResponse> getProductsByRootCategory(Long rootCategoryId, int page, int size, String sortBy, String sortDirection);

    Page<ProductDetailResponse> getProductsBySubCategory(Long subCategoryId, int page, int size, String sortBy, String sortDirection);

    Page<ProductDetailResponse> getProductsByBrand(Long brandId, ProductFilterRequest additionalFilters);

    Page<ProductDetailResponse> getProductsBySize(Long sizeId, ProductFilterRequest additionalFilters);

    Page<ProductDetailResponse> getProductsByColor(Long colorId, ProductFilterRequest additionalFilters);

    Page<ProductDetailResponse> getProductsWithDiscount(Double minDiscountPercent, Double maxDiscountPercent, int page, int size, String sortBy, String sortDirection);

    Page<ProductDetailResponse> getFavoriteProducts(Long userId, int page, int size, String sortBy, String sortDirection);

    Page<ProductDetailResponse> getProductsByPriceRange(Double minPrice, Double maxPrice, int page, int size, String sortBy, String sortDirection);

    Long countProductsByFilter(ProductFilterRequest filterRequest);

    ProductStatisticsResponse getProductStatistics();

    ProductStatisticsResponse getProductStatisticsByFilter(ProductFilterRequest filterRequest);

    Page<ProductDetailResponse> getNewProducts(int page, int size, String sortBy, String sortDirection);

    Page<ProductDetailResponse> getBestSellerProducts(int page, int size);

    Page<ProductDetailResponse> searchProductsAdvanced(String keyword, ProductFilterRequest additionalFilters);

    ProductDetailResponse getProductDetailById(Long id);
}