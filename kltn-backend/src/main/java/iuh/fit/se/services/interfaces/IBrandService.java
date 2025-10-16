package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.responses.BrandResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface IBrandService {
  BrandResponse createBrand(String name, String description, MultipartFile logoFile);

  BrandResponse updateBrand(Long id, String name, String description, MultipartFile logoFile);

  void deleteBrand(Long id);

  BrandResponse getBrandById(Long id);

  Page<BrandResponse> getAllBrands(Pageable pageable);

  List<BrandResponse> getAllBrandsWithoutPaging();
}
