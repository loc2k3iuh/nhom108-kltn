package iuh.fit.se.mapper.impls;

import iuh.fit.se.dtos.responses.BrandResponse;
import iuh.fit.se.dtos.responses.CategoryResponse;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.dtos.responses.ProductResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.mapper.ProductMapper;
import iuh.fit.se.repositories.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ProductMapperImpl implements ProductMapper {

  private final ProductVariantRepository productVariantRepository;
  private final ProductImageRepository productImageRepository;
  private final ProductDiscountRepository productDiscountRepository;
  private final FavoriteRepository favoriteRepository;
  private final ReviewRepository reviewRepository;
  private final OrderDetailRepository orderDetailRepository;

  @Override
  public ProductResponse toProductResponse(Product product) {
    if (product == null) {
      return null;
    }

    return ProductResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .description(product.getDescription())
        .basePrice(product.getBasePrice())
        .status(product.getStatus() != null ? product.getStatus().name() : null)
        .category(mapCategoryResponse(product.getCategory()))
        .brand(mapBrandResponse(product.getBrand()))
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public ProductDetailResponse toProductDetailResponse(Product product) {
    if (product == null) {
      return null;
    }

    List<ProductVariant> variants =
        Optional.ofNullable(productVariantRepository.findByProductId(product.getId()))
            .orElse(Collections.emptyList());

    List<ProductImage> images =
        Optional.ofNullable(
                productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId()))
            .orElse(Collections.emptyList());

    Double minPrice =
        variants.stream()
            .map(ProductVariant::getPrice)
            .filter(Objects::nonNull)
            .min(Double::compareTo)
            .orElse(product.getBasePrice());

    Double maxPrice =
        variants.stream()
            .map(ProductVariant::getPrice)
            .filter(Objects::nonNull)
            .max(Double::compareTo)
            .orElse(product.getBasePrice());

    int totalStock =
        variants.stream()
            .mapToInt(v -> v.getStockQuantity() != null ? v.getStockQuantity() : 0)
            .sum();
    Boolean inStock = totalStock > 0;

    List<ProductDetailResponse.SizeResponse> availableSizes =
        variants.stream()
            .map(ProductVariant::getSize)
            .filter(Objects::nonNull)
            .distinct()
            .map(this::mapSize)
            .collect(Collectors.toList());

    List<ProductDetailResponse.ColorResponse> availableColors =
        variants.stream()
            .map(ProductVariant::getColor)
            .filter(Objects::nonNull)
            .distinct()
            .map(this::mapColor)
            .collect(Collectors.toList());

    List<String> availableMaterials =
        variants.stream()
            .map(ProductVariant::getMaterial)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

    Double currentDiscountPercent = getCurrentDiscountPercent(product.getId());
    Double discountedPrice =
        currentDiscountPercent != null && minPrice != null
            ? minPrice * (1 - currentDiscountPercent / 100)
            : null;

    List<String> imageUrls =
        images.stream().map(ProductImage::getImageUrl).filter(Objects::nonNull).collect(Collectors.toList());

    String primaryImageUrl =
        images.stream()
            .filter(img -> img.getIsPrimary() != null && img.getIsPrimary())
            .map(ProductImage::getImageUrl)
            .findFirst()
            .orElse(imageUrls.stream().findFirst().orElse(null));

    Boolean isNew =
        product.getCreatedAt() != null
            && ChronoUnit.DAYS.between(product.getCreatedAt(), LocalDateTime.now()) <= 30;

    String slug = generateSlug(product.getName());

    Long favoriteCount =
        Optional.ofNullable(favoriteRepository.countByProductId(product.getId())).orElse(0L);
    Long reviewCount =
        Optional.ofNullable(reviewRepository.countByProductId(product.getId())).orElse(0L);
    Long orderCount =
        Optional.ofNullable(orderDetailRepository.countByProductId(product.getId())).orElse(0L);
    Double averageRating =
        Optional.ofNullable(reviewRepository.getAverageRatingByProductId(product.getId()))
            .orElse(0.0);

    return ProductDetailResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .description(product.getDescription())
        .basePrice(product.getBasePrice())
        .status(product.getStatus() != null ? product.getStatus().name() : null)
        .category(mapCategory(product.getCategory()))
        .rootCategory(mapRootCategory(product.getCategory()))
        .categoryPath(mapCategoryPath(product.getCategory()))
        .brand(mapBrand(product.getBrand()))
        .variants(variants.stream().map(this::mapVariant).collect(Collectors.toList()))
        .availableSizes(availableSizes)
        .availableColors(availableColors)
        .availableMaterials(availableMaterials)
        .minPrice(minPrice)
        .maxPrice(maxPrice)
        .currentDiscountPercent(currentDiscountPercent)
        .discountedPrice(discountedPrice)
        .totalStock(totalStock)
        .inStock(inStock)
        .imageUrls(imageUrls)
        .primaryImageUrl(primaryImageUrl)
        .createdAt(product.getCreatedAt())
        .updatedAt(product.getUpdatedAt())
        .isNew(isNew)
        .favoriteCount(favoriteCount != null ? favoriteCount.intValue() : 0)
        .reviewCount(reviewCount != null ? reviewCount.intValue() : 0)
        .orderCount(orderCount != null ? orderCount.intValue() : 0)
        .averageRating(averageRating)
        .slug(slug)
        .build();
  }

  // --- Mapping helpers ---
  private ProductDetailResponse.ProductVariantResponse mapVariant(ProductVariant variant) {
    if (variant == null) {
      return null;
    }

    return ProductDetailResponse.ProductVariantResponse.builder()
        .id(variant.getId())
        .sku(variant.getSku())
        .price(variant.getPrice())
        .stockQuantity(variant.getStockQuantity())
        .material(variant.getMaterial())
        .imageUrl(variant.getImageUrl())
        .size(mapSize(variant.getSize()))
        .color(mapColor(variant.getColor()))
        .inStock(variant.getStockQuantity() != null && variant.getStockQuantity() > 0)
        .build();
  }

  private ProductDetailResponse.SizeResponse mapSize(Size size) {
    if (size == null) {
      return null;
    }

    return ProductDetailResponse.SizeResponse.builder()
        .id(size.getId())
        .name(size.getName())
        .description(size.getDescription())
        .build();
  }

  private ProductDetailResponse.ColorResponse mapColor(Color color) {
    if (color == null) {
      return null;
    }

    return ProductDetailResponse.ColorResponse.builder()
        .id(color.getId())
        .name(color.getName())
        .hexCode(color.getHexCode())
        .description(color.getDescription())
        .build();
  }

  private Double getCurrentDiscountPercent(Long productId) {
    return productDiscountRepository
        .findActiveDiscountByProductId(productId)
        .map(productDiscount -> productDiscount.getDiscount().getValue())
        .orElse(null);
  }

  private String generateSlug(String name) {
    if (name == null) {
      return null;
    }
    return name.toLowerCase()
        .replaceAll("[^a-z0-9\\s-]", "")
        .replaceAll("\\s+", "-")
        .replaceAll("-+", "-")
        .replaceAll("^-|-$", "");
  }

  private ProductDetailResponse.CategoryResponse mapCategory(Category category) {
    if (category == null) {
      return null;
    }

    return ProductDetailResponse.CategoryResponse.builder()
        .id(category.getId())
        .name(category.getName())
        .description(category.getDescription())
        .parentId(category.getCategory() != null ? category.getCategory().getId() : null)
        .parentName(category.getCategory() != null ? category.getCategory().getName() : null)
        .build();
  }

  private ProductDetailResponse.CategoryResponse mapRootCategory(Category category) {
    if (category == null) {
      return null;
    }

    Category root = category;
    while (root.getCategory() != null) {
      root = root.getCategory();
    }

    return ProductDetailResponse.CategoryResponse.builder()
        .id(root.getId())
        .name(root.getName())
        .description(root.getDescription())
        .build();
  }

  private List<ProductDetailResponse.CategoryResponse> mapCategoryPath(Category category) {
    if (category == null) {
      return Collections.emptyList();
    }

    LinkedList<ProductDetailResponse.CategoryResponse> path = new LinkedList<>();
    Category current = category;

    while (current != null) {
      path.addFirst(
          ProductDetailResponse.CategoryResponse.builder()
              .id(current.getId())
              .name(current.getName())
              .description(current.getDescription())
              .parentId(current.getCategory() != null ? current.getCategory().getId() : null)
              .parentName(current.getCategory() != null ? current.getCategory().getName() : null)
              .build());
      current = current.getCategory();
    }

    return path;
  }

  private ProductDetailResponse.BrandResponse mapBrand(Brand brand) {
    if (brand == null) {
      return null;
    }

    return ProductDetailResponse.BrandResponse.builder()
        .id(brand.getId())
        .name(brand.getName())
        .description(brand.getDescription())
        .logoUrl(brand.getLogoUrl())
        .build();
  }

  private CategoryResponse mapCategoryResponse(Category category) {
    if (category == null) {
      return null;
    }

    return CategoryResponse.builder()
        .id(category.getId())
        .name(category.getName())
        .description(category.getDescription())
        .parentCategory(
            category.getCategory() != null ? mapCategoryResponse(category.getCategory()) : null)
        .build();
  }

  private BrandResponse mapBrandResponse(Brand brand) {
    if (brand == null) {
      return null;
    }

    return BrandResponse.builder()
        .id(brand.getId())
        .name(brand.getName())
        .description(brand.getDescription())
        .build();
  }
}
