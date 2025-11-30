package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.BrandResponse;
import iuh.fit.se.entities.Brand;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)")
@Component
public class BrandMapperImpl implements BrandMapper {

  @Override
  public BrandResponse toBrandResponse(Brand brand) {
    if (brand == null) {
      return null;
    }

    BrandResponse.BrandResponseBuilder brandResponse = BrandResponse.builder();

    brandResponse.id(brand.getId());
    brandResponse.name(brand.getName());
    brandResponse.description(brand.getDescription());
    brandResponse.logoUrl(brand.getLogoUrl());

    return brandResponse.build();
  }
}
