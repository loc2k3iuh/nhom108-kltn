package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ReviewResponse;
import iuh.fit.se.entities.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ProductMapper.class, UserMapper.class})
public interface ReviewMapper {

  @Mapping(source = "createdDate", target = "createdDate")
  @Mapping(source = "updatedDate", target = "updatedDate")
  ReviewResponse toReviewResponse(Review review);
}
