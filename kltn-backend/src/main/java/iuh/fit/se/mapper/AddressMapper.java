package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.AddressResponse;
import iuh.fit.se.entities.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {

  @Mapping(source = "user.id", target = "userId")
  @Mapping(source = "user.username", target = "username")
  AddressResponse toAddressResponse(Address address);
}
