package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.SizeResponse;
import iuh.fit.se.entities.Size;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)")
@Component
public class SizeMapperImpl implements SizeMapper {

  @Override
  public SizeResponse toSizeResponse(Size size) {
    if (size == null) {
      return null;
    }

    SizeResponse.SizeResponseBuilder sizeResponse = SizeResponse.builder();

    sizeResponse.id(size.getId());
    sizeResponse.name(size.getName());
    sizeResponse.description(size.getDescription());

    return sizeResponse.build();
  }
}
