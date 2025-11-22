package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.BrandResponse;
import iuh.fit.se.entities.Brand;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BrandMapper {
  BrandResponse toBrandResponse(Brand brand);
}
