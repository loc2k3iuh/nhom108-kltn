package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateProductVariantRequest;
import iuh.fit.se.dtos.requests.UpdateProductVariantRequest;
import iuh.fit.se.dtos.responses.ProductVariantResponse;
import iuh.fit.se.entities.Color;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.ProductVariant;
import iuh.fit.se.entities.Size;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.ProductVariantMapper;
import iuh.fit.se.repositories.ColorRepository;
import iuh.fit.se.repositories.ProductRepository;
import iuh.fit.se.repositories.ProductVariantRepository;
import iuh.fit.se.repositories.SizeRepository;
import iuh.fit.se.services.interfaces.IProductVariantService;
import iuh.fit.se.services.interfaces.IS3Service;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductVariantService implements IProductVariantService {

  ProductVariantRepository productVariantRepository;
  ProductRepository productRepository;
  ColorRepository colorRepository;
  SizeRepository sizeRepository;
  ProductVariantMapper productVariantMapper;
  IS3Service s3Service;

  @Override
  @Transactional
  public ProductVariantResponse createProductVariant(CreateProductVariantRequest request) {
    log.info("Creating product variant for product ID: {}", request.getProductId());

    // Validate product
    Product product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // Validate size
    Size size =
        sizeRepository
            .findById(request.getSizeId())
            .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

    // Validate color
    Color color =
        colorRepository
            .findById(request.getColorId())
            .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));

    // Check if variant already exists
    if (productVariantRepository
        .findByProductIdAndSizeIdAndColorId(
            request.getProductId(), request.getSizeId(), request.getColorId())
        .isPresent()) {
      throw new AppException(ErrorCode.PRODUCT_VARIANT_ALREADY_EXISTS);
    }

    // Upload image if provided
    String imageUrl = null;
    if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
      try {
        imageUrl = s3Service.uploadFile(request.getImageFile(), "product-variant");
        log.info("Product variant image uploaded: {}", imageUrl);
      } catch (Exception e) {
        log.error("Error uploading product variant image: {}", e.getMessage());
        throw new AppException(ErrorCode.UPLOAD_ERROR);
      }
    }

    ProductVariant productVariant =
        ProductVariant.builder()
            .sku(request.getSku())
            .price(request.getPrice())
            .stockQuantity(request.getStockQuantity())
            .material(request.getMaterial())
            .imageUrl(imageUrl)
            .product(product)
            .size(size)
            .color(color)
            .build();

    ProductVariant savedVariant = productVariantRepository.save(productVariant);
    log.info("Product variant created successfully with ID: {}", savedVariant.getId());

    return productVariantMapper.toProductVariantResponse(savedVariant);
  }

  @Override
  @Transactional
  public ProductVariantResponse updateProductVariant(Long id, UpdateProductVariantRequest request) {
    log.info("Updating product variant with ID: {}", id);

    ProductVariant productVariant =
        productVariantRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

    // Update fields if provided
    if (request.getSku() != null) {
      productVariant.setSku(request.getSku());
    }
    if (request.getPrice() != null) {
      productVariant.setPrice(request.getPrice());
    }
    if (request.getStockQuantity() != null) {
      productVariant.setStockQuantity(request.getStockQuantity());
    }
    if (request.getMaterial() != null) {
      productVariant.setMaterial(request.getMaterial());
    }

    // Update size if provided
    if (request.getSizeId() != null) {
      Size size =
          sizeRepository
              .findById(request.getSizeId())
              .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));
      productVariant.setSize(size);
    }

    // Update color if provided
    if (request.getColorId() != null) {
      Color color =
          colorRepository
              .findById(request.getColorId())
              .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
      productVariant.setColor(color);
    }

    // Handle image update
    if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
      // Delete old image if exists
      if (productVariant.getImageUrl() != null) {
        s3Service.deleteFile(productVariant.getImageUrl());
      }

      // Upload new image
      try {
        String newImageUrl = s3Service.uploadFile(request.getImageFile(), "product-variant");
        productVariant.setImageUrl(newImageUrl);
        log.info("Product variant image updated: {}", newImageUrl);
      } catch (Exception e) {
        log.error("Error uploading product variant image: {}", e.getMessage());
        throw new AppException(ErrorCode.UPLOAD_ERROR);
      }
    }

    ProductVariant savedVariant = productVariantRepository.save(productVariant);
    log.info("Product variant updated successfully with ID: {}", savedVariant.getId());

    return productVariantMapper.toProductVariantResponse(savedVariant);
  }

  @Override
  @Transactional
  public void deleteProductVariant(Long id) {
    log.info("Deleting product variant with ID: {}", id);

    ProductVariant productVariant =
        productVariantRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

    // Delete image from S3 if exists
    if (productVariant.getImageUrl() != null) {
      s3Service.deleteFile(productVariant.getImageUrl());
    }

    productVariantRepository.deleteById(id);
    log.info("Product variant deleted successfully with ID: {}", id);
  }

  @Override
  public ProductVariantResponse getProductVariantById(Long id) {
    log.info("Getting product variant with ID: {}", id);

    ProductVariant productVariant =
        productVariantRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

    return productVariantMapper.toProductVariantResponse(productVariant);
  }

  @Override
  public List<ProductVariantResponse> getProductVariantsByProductId(Long productId) {
    log.info("Getting product variants for product ID: {}", productId);

    List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
    return variants.stream().map(productVariantMapper::toProductVariantResponse).toList();
  }

  @Override
  public Page<ProductVariantResponse> getAllProductVariants(Pageable pageable) {
    log.info("Getting all product variants with pagination");

    Page<ProductVariant> variants = productVariantRepository.findAll(pageable);
    return variants.map(productVariantMapper::toProductVariantResponse);
  }

  @Override
  @Transactional
  public void updateStock(Long id, Integer quantity) {
    log.info("Updating stock for product variant ID: {} to quantity: {}", id, quantity);

    ProductVariant productVariant =
        productVariantRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

    if (quantity < 0) {
      throw new AppException(ErrorCode.INVALID_QUANTITY);
    }

    productVariant.setStockQuantity(quantity);
    productVariantRepository.save(productVariant);

    log.info("Stock updated successfully for product variant ID: {}", id);
  }

  @Override
  public List<ProductVariantResponse> getAvailableVariantsByProduct(Long productId) {
    log.info("Getting available variants for product ID: {}", productId);

    List<ProductVariant> variants =
        productVariantRepository.findByProductIdAndStockQuantityGreaterThan(productId, 0);
    return variants.stream().map(productVariantMapper::toProductVariantResponse).toList();
  }
}
