package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateProductRequest;
import iuh.fit.se.dtos.requests.UpdateProductRequest;
import iuh.fit.se.dtos.responses.ProductResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.enums.ProductStatus;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.ProductImageMapper;
import iuh.fit.se.mapper.ProductMapper;
import iuh.fit.se.mapper.ProductVariantMapper;
import iuh.fit.se.repositories.*;
import iuh.fit.se.services.interfaces.IProductService;
import iuh.fit.se.services.interfaces.IS3Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService implements IProductService {

  ProductRepository productRepository;
  CategoryRepository categoryRepository;
  BrandRepository brandRepository;
  ProductImageRepository productImageRepository;
  ProductVariantRepository productVariantRepository;
  ReviewRepository reviewRepository;
  ProductMapper productMapper;
  ProductImageMapper productImageMapper;
  ProductVariantMapper productVariantMapper;
  IS3Service s3Service;

  @Override
  @Transactional
  public ProductResponse createProduct(CreateProductRequest request) {
    log.info("Creating product with name: {}", request.getName());

    // Validate category
    Category category = null;
    if (request.getCategoryId() != null) {
      category =
          categoryRepository
              .findById(request.getCategoryId())
              .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    // Validate brand
    Brand brand = null;
    if (request.getBrandId() != null) {
      brand =
          brandRepository
              .findById(request.getBrandId())
              .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
    }

    // Create product
    Product product =
        Product.builder()
            .name(request.getName())
            .description(request.getDescription())
            .basePrice(request.getBasePrice())
            .status(ProductStatus.ACTIVE)
            .category(category)
            .brand(brand)
            .build();

    Product savedProduct = productRepository.save(product);
    log.info("Product created successfully with ID: {}", savedProduct.getId());

    // Handle images
    List<ProductImage> productImages = new ArrayList<>();
    if (request.getImages() != null && !request.getImages().isEmpty()) {
      productImages = uploadProductImages(savedProduct, request.getImages());
    }

    return buildProductResponse(savedProduct, productImages, new ArrayList<>());
  }

  @Override
  @Transactional
  public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
    log.info("Updating product with ID: {}", id);

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // Update basic info
    if (request.getName() != null) {
      product.setName(request.getName());
    }
    if (request.getDescription() != null) {
      product.setDescription(request.getDescription());
    }
    if (request.getBasePrice() != null) {
      product.setBasePrice(request.getBasePrice());
    }
    if (request.getStatus() != null) {
      product.setStatus(ProductStatus.valueOf(request.getStatus()));
    }

    // Update category
    if (request.getCategoryId() != null) {
      Category category =
          categoryRepository
              .findById(request.getCategoryId())
              .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
      product.setCategory(category);
    }

    // Update brand
    if (request.getBrandId() != null) {
      Brand brand =
          brandRepository
              .findById(request.getBrandId())
              .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
      product.setBrand(brand);
    }

    Product savedProduct = productRepository.save(product);

    // Handle image updates
    handleImageUpdates(savedProduct, request);

    List<ProductImage> images =
        productImageRepository.findByProductIdOrderBySortOrder(savedProduct.getId());
    List<ProductVariant> variants = productVariantRepository.findByProductId(savedProduct.getId());

    log.info("Product updated successfully with ID: {}", savedProduct.getId());

    return buildProductResponse(savedProduct, images, variants);
  }

  @Override
  @Transactional
  public void deleteProduct(Long id) {
    log.info("Deleting product with ID: {}", id);

    // Delete images from S3
    List<ProductImage> images = productImageRepository.findByProductId(id);
    for (ProductImage image : images) {
      if (image.getImageUrl() != null) {
        s3Service.deleteFile(image.getImageUrl());
      }
    }

    productRepository.deleteById(id);
    log.info("Product deleted successfully with ID: {}", id);
  }

  @Override
  public ProductResponse getProductById(Long id) {
    log.info("Getting product with ID: {}", id);

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    List<ProductImage> images = productImageRepository.findByProductIdOrderBySortOrder(id);
    List<ProductVariant> variants = productVariantRepository.findByProductId(id);

    return buildProductResponse(product, images, variants);
  }

  @Override
  public Page<ProductResponse> getAllProducts(Pageable pageable) {
    log.info("Getting all products with pagination");

    Page<Product> products = productRepository.findAll(pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable) {
    log.info("Getting products by status: {}", status);

    Page<Product> products = productRepository.findByStatus(status, pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
    log.info("Getting products by category ID: {}", categoryId);

    Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public Page<ProductResponse> getProductsByBrand(Long brandId, Pageable pageable) {
    log.info("Getting products by brand ID: {}", brandId);

    Page<Product> products = productRepository.findByBrandId(brandId, pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
    log.info("Searching products with keyword: {}", keyword);

    Page<Product> products = productRepository.findByKeyword(keyword, pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public Page<ProductResponse> getProductsByPriceRange(
      Double minPrice, Double maxPrice, Pageable pageable) {
    log.info("Getting products by price range: {} - {}", minPrice, maxPrice);

    Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  public List<ProductResponse> getLatestProducts(int limit) {
    log.info("Getting latest {} products", limit);

    List<Product> products = productRepository.findTop10ByStatusOrderByIdDesc(ProductStatus.ACTIVE);
    return products.stream()
        .limit(limit)
        .map(
            product -> {
              List<ProductImage> images =
                  productImageRepository.findByProductIdOrderBySortOrder(product.getId());
              List<ProductVariant> variants =
                  productVariantRepository.findByProductId(product.getId());
              return buildProductResponse(product, images, variants);
            })
        .toList();
  }

  @Override
  public Page<ProductResponse> getAvailableProducts(Pageable pageable) {
    log.info("Getting available products");

    Page<Product> products = productRepository.findAvailableProducts(pageable);
    return products.map(
        product -> {
          List<ProductImage> images =
              productImageRepository.findByProductIdOrderBySortOrder(product.getId());
          List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
          return buildProductResponse(product, images, variants);
        });
  }

  @Override
  @Transactional
  public void updateProductStatus(Long id, ProductStatus status) {
    log.info("Updating product status with ID: {} to status: {}", id, status);

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    product.setStatus(status);
    productRepository.save(product);

    log.info("Product status updated successfully with ID: {}", id);
  }

  private List<ProductImage> uploadProductImages(Product product, List<MultipartFile> imageFiles) {
    List<ProductImage> productImages = new ArrayList<>();

    IntStream.range(0, imageFiles.size())
        .forEach(
            index -> {
              MultipartFile file = imageFiles.get(index);
              if (file != null && !file.isEmpty()) {
                try {
                  String imageUrl = s3Service.uploadFile(file, "product-image");

                  ProductImage productImage =
                      ProductImage.builder()
                          .imageUrl(imageUrl)
                          .isMain(index == 0) // First image is main
                          .sortOrder(index)
                          .product(product)
                          .build();

                  ProductImage savedImage = productImageRepository.save(productImage);
                  productImages.add(savedImage);
                  log.info("Product image uploaded: {}", imageUrl);
                } catch (Exception e) {
                  log.error("Error uploading product image: {}", e.getMessage());
                  throw new AppException(ErrorCode.UPLOAD_ERROR);
                }
              }
            });

    return productImages;
  }

  private void handleImageUpdates(Product product, UpdateProductRequest request) {
    // Delete specified images
    if (request.getImagesToDelete() != null && !request.getImagesToDelete().isEmpty()) {
      for (Long imageId : request.getImagesToDelete()) {
        ProductImage image = productImageRepository.findById(imageId).orElse(null);
        if (image != null && image.getProduct().getId().equals(product.getId())) {
          if (image.getImageUrl() != null) {
            s3Service.deleteFile(image.getImageUrl());
          }
          productImageRepository.deleteById(imageId);
          log.info("Product image deleted: {}", imageId);
        }
      }
    }

    // Add new images
    if (request.getNewImages() != null && !request.getNewImages().isEmpty()) {
      uploadProductImages(product, request.getNewImages());
    }
  }

  private ProductResponse buildProductResponse(
      Product product, List<ProductImage> images, List<ProductVariant> variants) {
    ProductResponse response = productMapper.toProductResponse(product);

    // Set images
    if (!images.isEmpty()) {
      response.setImages(images.stream().map(productImageMapper::toProductImageResponse).toList());
    }

    // Set variants
    if (!variants.isEmpty()) {
      response.setVariants(
          variants.stream().map(productVariantMapper::toProductVariantResponse).toList());
    }

    // Calculate rating statistics
    List<Review> reviews = reviewRepository.findByProductId(product.getId());
    if (!reviews.isEmpty()) {
      double averageRating = reviews.stream().mapToLong(Review::getRating).average().orElse(0.0);
      response.setAverageRating(averageRating);
      response.setTotalReviews(reviews.size());
    } else {
      response.setAverageRating(0.0);
      response.setTotalReviews(0);
    }

    return response;
  }
}
