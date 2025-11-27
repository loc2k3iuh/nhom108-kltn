package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateAddressRequest;
import iuh.fit.se.dtos.requests.UpdateAddressRequest;
import iuh.fit.se.dtos.responses.AddressResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IAddressService {
  AddressResponse createAddress(CreateAddressRequest request);

  AddressResponse updateAddress(Long id, UpdateAddressRequest request);

  void deleteAddress(Long id);

  AddressResponse getAddressById(Long id);

  Page<AddressResponse> getAllAddresses(Pageable pageable);

  List<AddressResponse> getAddressesByUserId(Long userId);

  Page<AddressResponse> getMyAddresses(String city, Pageable pageable);
}

