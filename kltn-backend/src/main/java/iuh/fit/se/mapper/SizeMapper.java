package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.SizeResponse;
import iuh.fit.se.entities.Size;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SizeMapper {
  SizeResponse toSizeResponse(Size size);
}
