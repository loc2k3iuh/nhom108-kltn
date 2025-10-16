package iuh.fit.se.repositories;

import iuh.fit.se.entities.Product;
import iuh.fit.se.enums.ProductStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  Page<Product> findByStatus(ProductStatus status, Pageable pageable);

  Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

  Page<Product> findByBrandId(Long brandId, Pageable pageable);

  @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
  Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

  @Query("SELECT p FROM Product p WHERE p.basePrice BETWEEN :minPrice AND :maxPrice")
  Page<Product> findByPriceRange(
      @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);

  @Query(
      "SELECT p FROM Product p JOIN p.category c WHERE c.id = :categoryId AND p.status = :status")
  Page<Product> findByCategoryIdAndStatus(
      @Param("categoryId") Long categoryId,
      @Param("status") ProductStatus status,
      Pageable pageable);

  List<Product> findTop10ByStatusOrderByIdDesc(ProductStatus status);

  @Query(
      "SELECT p FROM Product p JOIN ProductVariant pv ON p.id = pv.product.id WHERE pv.stockQuantity > 0")
  Page<Product> findAvailableProducts(Pageable pageable);

  // Advanced filtering queries
  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN p.category c "
          + "LEFT JOIN c.category parent "
          + "WHERE (:rootCategoryId IS NULL OR parent.id = :rootCategoryId OR (parent IS NULL AND c.id = :rootCategoryId))")
  Page<Product> findByRootCategory(@Param("rootCategoryId") Long rootCategoryId, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "WHERE (:categoryIds IS NULL OR p.category.id IN :categoryIds)")
  Page<Product> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p " + "WHERE (:brandIds IS NULL OR p.brand.id IN :brandIds)")
  Page<Product> findByBrandIds(@Param("brandIds") List<Long> brandIds, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "WHERE (:sizeIds IS NULL OR pv.size.id IN :sizeIds)")
  Page<Product> findBySizeIds(@Param("sizeIds") List<Long> sizeIds, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "WHERE (:colorIds IS NULL OR pv.color.id IN :colorIds)")
  Page<Product> findByColorIds(@Param("colorIds") List<Long> colorIds, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN ProductDiscount pd ON p.id = pd.product.id "
          + "JOIN Discount d ON pd.discount.id = d.id "
          + "WHERE d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP")
  Page<Product> findProductsWithActiveDiscount(Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN ProductDiscount pd ON p.id = pd.product.id "
          + "JOIN Discount d ON pd.discount.id = d.id "
          + "WHERE d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP "
          + "AND d.value BETWEEN :minPercent AND :maxPercent")
  Page<Product> findProductsByDiscountRange(
      @Param("minPercent") Double minPercent,
      @Param("maxPercent") Double maxPercent,
      Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN Favorite f ON p.id = f.product.id "
          + "WHERE f.user.id = :userId")
  Page<Product> findFavoriteProductsByUserId(@Param("userId") Long userId, Pageable pageable);

  @Query(
      "SELECT DISTINCT p FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "WHERE (:material IS NULL OR pv.material LIKE %:material%)")
  Page<Product> findByMaterial(@Param("material") String material, Pageable pageable);

  // Statistics queries
  @Query("SELECT COUNT(p) FROM Product p WHERE p.status = :status")
  Long countByStatus(@Param("status") ProductStatus status);

  @Query(
      "SELECT COUNT(DISTINCT p) FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "WHERE pv.stockQuantity > 0")
  Long countInStockProducts();

  @Query("SELECT c.name, COUNT(p) FROM Product p " + "JOIN p.category c " + "GROUP BY c.id, c.name")
  List<Object[]> countProductsByCategory();

  @Query("SELECT b.name, COUNT(p) FROM Product p " + "JOIN p.brand b " + "GROUP BY b.id, b.name")
  List<Object[]> countProductsByBrand();

  @Query(
      "SELECT s.name, COUNT(DISTINCT p) FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "JOIN pv.size s "
          + "GROUP BY s.id, s.name")
  List<Object[]> countProductsBySize();

  @Query(
      "SELECT c.name, COUNT(DISTINCT p) FROM Product p "
          + "JOIN ProductVariant pv ON p.id = pv.product.id "
          + "JOIN pv.color c "
          + "GROUP BY c.id, c.name")
  List<Object[]> countProductsByColor();

  @Query(
      "SELECT MIN(p.basePrice), MAX(p.basePrice), AVG(p.basePrice) FROM Product p WHERE p.status = 'ACTIVE'")
  Object[] getPriceStatistics();

  @Query(
      "SELECT SUM(pv.stockQuantity) FROM ProductVariant pv "
          + "JOIN pv.product p WHERE p.status = 'ACTIVE'")
  Long getTotalStock();

  @Query(
      "SELECT p FROM Product p "
          + "LEFT JOIN ProductVariant pv ON p.id = pv.product.id "
          + "LEFT JOIN ProductDiscount pd ON p.id = pd.product.id "
          + "LEFT JOIN Discount d ON pd.discount.id = d.id "
          + "LEFT JOIN Favorite f ON p.id = f.product.id "
          + "LEFT JOIN Review r ON p.id = r.product.id "
          + "LEFT JOIN OrderDetail od ON od.productVariant.product.id = p.id "
          + "LEFT JOIN p.category c "
          + "LEFT JOIN c.category parent "
          + "WHERE (:categoryIds IS NULL OR p.category.id IN :categoryIds) "
          + "AND (:brandIds IS NULL OR p.brand.id IN :brandIds) "
          + "AND (:sizeIds IS NULL OR pv.size.id IN :sizeIds) "
          + "AND (:colorIds IS NULL OR pv.color.id IN :colorIds) "
          + "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) "
          + "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) "
          + "AND (:status IS NULL OR p.status = :status) "
          + "AND (:inStock IS NULL OR "
          + "     (:inStock = true AND pv.stockQuantity > 0) OR "
          + "     (:inStock = false)) "
          + "AND (:hasDiscount IS NULL OR "
          + "     (:hasDiscount = true AND d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP) OR "
          + "     (:hasDiscount = false)) "
          + "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
          + "AND (:material IS NULL OR LOWER(pv.material) LIKE LOWER(CONCAT('%', :material, '%'))) "
          + "AND (:isFavorite IS NULL OR "
          + "     (:isFavorite = true AND f.id IS NOT NULL AND (:userId IS NULL OR f.user.id = :userId)) OR "
          + "     (:isFavorite = false)) "
          + "AND ( :isNew IS NULL OR ( :isNew = true AND p.createdAt >= :newSinceDate ) OR ( :isNew = false AND p.createdAt < :newSinceDate ) ) "
          + "AND (:rootCategoryId IS NULL OR parent.id = :rootCategoryId OR (parent IS NULL AND c.id = :rootCategoryId)) "
          + "GROUP BY p "
          + "HAVING ( :minFavoriteCount IS NULL OR COUNT(DISTINCT f) >= :minFavoriteCount ) "
          + "AND ( :minReviewCount IS NULL OR COUNT(DISTINCT r) >= :minReviewCount ) "
          + "AND ( :minOrderCount IS NULL OR COUNT(DISTINCT od) >= :minOrderCount ) "
          + "AND ( :minAverageRating IS NULL OR COALESCE(AVG(r.rating),0) >= :minAverageRating )")
  Page<Product> findProductsWithComplexFilter(
      @Param("categoryIds") List<Long> categoryIds,
      @Param("brandIds") List<Long> brandIds,
      @Param("sizeIds") List<Long> sizeIds,
      @Param("colorIds") List<Long> colorIds,
      @Param("minPrice") Double minPrice,
      @Param("maxPrice") Double maxPrice,
      @Param("status") ProductStatus status,
      @Param("inStock") Boolean inStock,
      @Param("hasDiscount") Boolean hasDiscount,
      @Param("keyword") String keyword,
      @Param("material") String material,
      @Param("isFavorite") Boolean isFavorite,
      @Param("userId") Long userId,
      @Param("rootCategoryId") Long rootCategoryId,
      @Param("isNew") Boolean isNew,
      @Param("newSinceDate") java.time.LocalDateTime newSinceDate,
      @Param("minFavoriteCount") Integer minFavoriteCount,
      @Param("minReviewCount") Integer minReviewCount,
      @Param("minOrderCount") Integer minOrderCount,
      @Param("minAverageRating") Double minAverageRating,
      Pageable pageable);

  @Query(
      "SELECT p FROM Product p "
          + "LEFT JOIN ProductVariant pv ON p.id = pv.product.id "
          + "LEFT JOIN ProductDiscount pd ON p.id = pd.product.id "
          + "LEFT JOIN Discount d ON pd.discount.id = d.id "
          + "LEFT JOIN Favorite f ON p.id = f.product.id "
          + "LEFT JOIN Review r ON p.id = r.product.id "
          + "LEFT JOIN OrderDetail od ON od.productVariant.product.id = p.id "
          + "LEFT JOIN p.category c "
          + "LEFT JOIN c.category parent "
          + "WHERE (:categoryIds IS NULL OR p.category.id IN :categoryIds) "
          + "AND (:brandIds IS NULL OR p.brand.id IN :brandIds) "
          + "AND (:sizeIds IS NULL OR pv.size.id IN :sizeIds) "
          + "AND (:colorIds IS NULL OR pv.color.id IN :colorIds) "
          + "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) "
          + "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) "
          + "AND (:status IS NULL OR p.status = :status) "
          + "AND (:inStock IS NULL OR "
          + "     (:inStock = true AND pv.stockQuantity > 0) OR "
          + "     (:inStock = false)) "
          + "AND (:hasDiscount IS NULL OR "
          + "     (:hasDiscount = true AND d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP) OR "
          + "     (:hasDiscount = false)) "
          + "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
          + "AND (:material IS NULL OR LOWER(pv.material) LIKE LOWER(CONCAT('%', :material, '%'))) "
          + "AND (:isFavorite IS NULL OR "
          + "     (:isFavorite = true AND f.id IS NOT NULL AND (:userId IS NULL OR f.user.id = :userId)) OR "
          + "     (:isFavorite = false)) "
          + "AND ( :isNew IS NULL OR ( :isNew = true AND p.createdAt >= :newSinceDate ) OR ( :isNew = false AND p.createdAt < :newSinceDate ) ) "
          + "AND (:rootCategoryId IS NULL OR parent.id = :rootCategoryId OR (parent IS NULL AND c.id = :rootCategoryId)) "
          + "GROUP BY p "
          + "HAVING ( :minFavoriteCount IS NULL OR COUNT(DISTINCT f) >= :minFavoriteCount ) "
          + "AND ( :minReviewCount IS NULL OR COUNT(DISTINCT r) >= :minReviewCount ) "
          + "AND ( :minOrderCount IS NULL OR COUNT(DISTINCT od) >= :minOrderCount ) "
          + "AND ( :minAverageRating IS NULL OR COALESCE(AVG(r.rating),0) >= :minAverageRating ) "
          + "ORDER BY CASE "
          + "  WHEN :sortBy = 'favoriteCount' THEN COUNT(DISTINCT f) "
          + "  WHEN :sortBy = 'reviewCount' THEN COUNT(DISTINCT r) "
          + "  WHEN :sortBy = 'orderCount' THEN COUNT(DISTINCT od) "
          + "  WHEN :sortBy = 'averageRating' THEN COALESCE(AVG(r.rating),0) "
          + "  WHEN :sortBy = 'basePrice' THEN p.basePrice "
          + "  WHEN :sortBy = 'minPrice' THEN COALESCE(MIN(pv.price), p.basePrice) "
          + "  WHEN :sortBy = 'maxPrice' THEN COALESCE(MAX(pv.price), p.basePrice) "
          + "  WHEN :sortBy = 'currentDiscountPercent' THEN COALESCE(MAX(CASE WHEN d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP THEN d.value ELSE 0 END), 0) "
          + "  WHEN :sortBy = 'discountedPrice' THEN (COALESCE(MIN(pv.price), p.basePrice) * (1 - COALESCE(MAX(CASE WHEN d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP THEN d.value ELSE 0 END), 0) / 100)) "
          + "  WHEN :sortBy = 'totalStock' THEN COALESCE(SUM(CASE WHEN pv.stockQuantity IS NOT NULL THEN pv.stockQuantity ELSE 0 END), 0) "
          + "  ELSE p.id END ASC")
  Page<Product> findProductsWithComplexFilterOrderByAggAsc(
      @Param("categoryIds") List<Long> categoryIds,
      @Param("brandIds") List<Long> brandIds,
      @Param("sizeIds") List<Long> sizeIds,
      @Param("colorIds") List<Long> colorIds,
      @Param("minPrice") Double minPrice,
      @Param("maxPrice") Double maxPrice,
      @Param("status") ProductStatus status,
      @Param("inStock") Boolean inStock,
      @Param("hasDiscount") Boolean hasDiscount,
      @Param("keyword") String keyword,
      @Param("material") String material,
      @Param("isFavorite") Boolean isFavorite,
      @Param("userId") Long userId,
      @Param("rootCategoryId") Long rootCategoryId,
      @Param("isNew") Boolean isNew,
      @Param("newSinceDate") java.time.LocalDateTime newSinceDate,
      @Param("minFavoriteCount") Integer minFavoriteCount,
      @Param("minReviewCount") Integer minReviewCount,
      @Param("minOrderCount") Integer minOrderCount,
      @Param("minAverageRating") Double minAverageRating,
      @Param("sortBy") String sortBy,
      Pageable pageable);

  @Query(
      "SELECT p FROM Product p "
          + "LEFT JOIN ProductVariant pv ON p.id = pv.product.id "
          + "LEFT JOIN ProductDiscount pd ON p.id = pd.product.id "
          + "LEFT JOIN Discount d ON pd.discount.id = d.id "
          + "LEFT JOIN Favorite f ON p.id = f.product.id "
          + "LEFT JOIN Review r ON p.id = r.product.id "
          + "LEFT JOIN OrderDetail od ON od.productVariant.product.id = p.id "
          + "LEFT JOIN p.category c "
          + "LEFT JOIN c.category parent "
          + "WHERE (:categoryIds IS NULL OR p.category.id IN :categoryIds) "
          + "AND (:brandIds IS NULL OR p.brand.id IN :brandIds) "
          + "AND (:sizeIds IS NULL OR pv.size.id IN :sizeIds) "
          + "AND (:colorIds IS NULL OR pv.color.id IN :colorIds) "
          + "AND (:minPrice IS NULL OR p.basePrice >= :minPrice) "
          + "AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice) "
          + "AND (:status IS NULL OR p.status = :status) "
          + "AND (:inStock IS NULL OR "
          + "     (:inStock = true AND pv.stockQuantity > 0) OR "
          + "     (:inStock = false)) "
          + "AND (:hasDiscount IS NULL OR "
          + "     (:hasDiscount = true AND d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP) OR "
          + "     (:hasDiscount = false)) "
          + "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
          + "AND (:material IS NULL OR LOWER(pv.material) LIKE LOWER(CONCAT('%', :material, '%'))) "
          + "AND (:isFavorite IS NULL OR "
          + "     (:isFavorite = true AND f.id IS NOT NULL AND (:userId IS NULL OR f.user.id = :userId)) OR "
          + "     (:isFavorite = false)) "
          + "AND ( :isNew IS NULL OR ( :isNew = true AND p.createdAt >= :newSinceDate ) OR ( :isNew = false AND p.createdAt < :newSinceDate ) ) "
          + "AND (:rootCategoryId IS NULL OR parent.id = :rootCategoryId OR (parent IS NULL AND c.id = :rootCategoryId)) "
          + "GROUP BY p "
          + "HAVING ( :minFavoriteCount IS NULL OR COUNT(DISTINCT f) >= :minFavoriteCount ) "
          + "AND ( :minOrderCount IS NULL OR COUNT(DISTINCT od) >= :minOrderCount ) "
          + "AND ( :minAverageRating IS NULL OR COALESCE(AVG(r.rating),0) >= :minAverageRating ) "
              + "AND ( :minReviewCount IS NULL OR COUNT(DISTINCT r) >= :minReviewCount ) "
              + "ORDER BY CASE "
          + "  WHEN :sortBy = 'favoriteCount' THEN COUNT(DISTINCT f) "
              + "  WHEN :sortBy = 'reviewCount' THEN COUNT(DISTINCT r) "
              + "  WHEN :sortBy = 'orderCount' THEN COUNT(DISTINCT od) "
          + "  WHEN :sortBy = 'averageRating' THEN COALESCE(AVG(r.rating),0) "
          + "  WHEN :sortBy = 'basePrice' THEN p.basePrice "
          + "  WHEN :sortBy = 'minPrice' THEN COALESCE(MIN(pv.price), p.basePrice) "
          + "  WHEN :sortBy = 'maxPrice' THEN COALESCE(MAX(pv.price), p.basePrice) "
          + "  WHEN :sortBy = 'currentDiscountPercent' THEN COALESCE(MAX(CASE WHEN d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP THEN d.value ELSE 0 END), 0) "
          + "  WHEN :sortBy = 'discountedPrice' THEN (COALESCE(MIN(pv.price), p.basePrice) * (1 - COALESCE(MAX(CASE WHEN d.startDate <= CURRENT_TIMESTAMP AND d.endDate >= CURRENT_TIMESTAMP THEN d.value ELSE 0 END), 0) / 100)) "
          + "  WHEN :sortBy = 'totalStock' THEN COALESCE(SUM(CASE WHEN pv.stockQuantity IS NOT NULL THEN pv.stockQuantity ELSE 0 END), 0) "
          + "  ELSE p.id END DESC")
  Page<Product> findProductsWithComplexFilterOrderByAggDesc(
      @Param("categoryIds") List<Long> categoryIds,
      @Param("brandIds") List<Long> brandIds,
      @Param("sizeIds") List<Long> sizeIds,
      @Param("colorIds") List<Long> colorIds,
      @Param("minPrice") Double minPrice,
      @Param("maxPrice") Double maxPrice,
      @Param("status") ProductStatus status,
      @Param("inStock") Boolean inStock,
      @Param("hasDiscount") Boolean hasDiscount,
      @Param("keyword") String keyword,
      @Param("material") String material,
      @Param("isFavorite") Boolean isFavorite,
      @Param("userId") Long userId,
      @Param("rootCategoryId") Long rootCategoryId,
      @Param("isNew") Boolean isNew,
      @Param("newSinceDate") java.time.LocalDateTime newSinceDate,
      @Param("minFavoriteCount") Integer minFavoriteCount,
      @Param("minReviewCount") Integer minReviewCount,
      @Param("minOrderCount") Integer minOrderCount,
      @Param("minAverageRating") Double minAverageRating,
      @Param("sortBy") String sortBy,
      Pageable pageable);
}
