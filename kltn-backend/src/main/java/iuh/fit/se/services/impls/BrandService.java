package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.responses.BrandResponse;
import iuh.fit.se.entities.Brand;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.BrandMapper;
import iuh.fit.se.repositories.BrandRepository;
import iuh.fit.se.services.interfaces.IBrandService;
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
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandService implements IBrandService {

  BrandRepository brandRepository;
  BrandMapper brandMapper;
  IS3Service s3Service;

  @Override
  @Transactional
  public BrandResponse createBrand(String name, String description, MultipartFile logoFile) {
    log.info("Creating brand with name: {}", name);

    String logoUrl = null;
    if (logoFile != null && !logoFile.isEmpty()) {
      try {
        logoUrl = s3Service.uploadFile(logoFile, "brand-logo");
        log.info("Logo uploaded successfully: {}", logoUrl);
      } catch (Exception e) {
        log.error("Error uploading brand logo: {}", e.getMessage());
        throw new AppException(ErrorCode.UPLOAD_ERROR);
      }
    }

    Brand brand = Brand.builder().name(name).description(description).logoUrl(logoUrl).build();

    Brand savedBrand = brandRepository.save(brand);
    log.info("Brand created successfully with ID: {}", savedBrand.getId());

    return brandMapper.toBrandResponse(savedBrand);
  }

  @Override
  @Transactional
  public BrandResponse updateBrand(
      Long id, String name, String description, MultipartFile logoFile) {
    log.info("Updating brand with ID: {}", id);

    Brand brand =
        brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

    // Update basic info
    if (name != null) {
      brand.setName(name);
    }
    if (description != null) {
      brand.setDescription(description);
    }

    // Handle logo update
    if (logoFile != null && !logoFile.isEmpty()) {
      // Delete old logo if exists
      if (brand.getLogoUrl() != null) {
        s3Service.deleteFile(brand.getLogoUrl());
      }

      // Upload new logo
      try {
        String newLogoUrl = s3Service.uploadFile(logoFile, "brand-logo");
        brand.setLogoUrl(newLogoUrl);
        log.info("Logo updated successfully: {}", newLogoUrl);
      } catch (Exception e) {
        log.error("Error uploading brand logo: {}", e.getMessage());
        throw new AppException(ErrorCode.UPLOAD_ERROR);
      }
    }

    Brand savedBrand = brandRepository.save(brand);
    log.info("Brand updated successfully with ID: {}", savedBrand.getId());

    return brandMapper.toBrandResponse(savedBrand);
  }

  @Override
  @Transactional
  public void deleteBrand(Long id) {
    log.info("Deleting brand with ID: {}", id);

    Brand brand =
        brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

    // Delete logo from S3 if exists
    if (brand.getLogoUrl() != null) {
      s3Service.deleteFile(brand.getLogoUrl());
    }

    brandRepository.deleteById(id);
    log.info("Brand deleted successfully with ID: {}", id);
  }

  @Override
  public BrandResponse getBrandById(Long id) {
    log.info("Getting brand with ID: {}", id);

    Brand brand =
        brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

    return brandMapper.toBrandResponse(brand);
  }

  @Override
  public Page<BrandResponse> getAllBrands(Pageable pageable) {
    log.info("Getting all brands with pagination");

    Page<Brand> brands = brandRepository.findAll(pageable);
    return brands.map(brandMapper::toBrandResponse);
  }

  @Override
  public List<BrandResponse> getAllBrandsWithoutPaging() {
    log.info("Getting all brands without pagination");

    List<Brand> brands = brandRepository.findAll();
    return brands.stream().map(brandMapper::toBrandResponse).toList();
  }
}
