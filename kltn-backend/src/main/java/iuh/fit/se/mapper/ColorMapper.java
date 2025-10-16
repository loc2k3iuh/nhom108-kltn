package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ColorResponse;
import iuh.fit.se.entities.Color;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ColorMapper {
  ColorResponse toColorResponse(Color color);
}
