package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateAddressRequest;
import iuh.fit.se.dtos.requests.UpdateAddressRequest;
import iuh.fit.se.dtos.responses.AddressResponse;
import iuh.fit.se.entities.Address;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.AddressMapper;
import iuh.fit.se.repositories.AddressRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IAddressService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressService implements IAddressService {

  AddressRepository addressRepository;
  UserRepository userRepository;
  AddressMapper addressMapper;

  @Override
  @Transactional
  public AddressResponse createAddress(CreateAddressRequest request) {
    log.info("Creating address for user");

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    User user =
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    if (addressRepository.existsByPhoneNumber(request.getPhoneNumber())) {
      throw new AppException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
    }

    Address address =
        Address.builder()
            .street(request.getStreet())
            .city(request.getCity())
            .zip(request.getZip())
            .ward(request.getWard())
            .district(request.getDistrict())
            .detailAddress(request.getDetailAddress())
            .phoneNumber(request.getPhoneNumber())
            .user(user)
            .build();

    Address savedAddress = addressRepository.save(address);
    log.info("Address created successfully with ID: {}", savedAddress.getId());

    return addressMapper.toAddressResponse(savedAddress);
  }

  @Override
  @Transactional
  public AddressResponse updateAddress(Long id, UpdateAddressRequest request) {
    log.info("Updating address with ID: {}", id);

    Address address =
        addressRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    User currentUser =
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    boolean isOwner = address.getUser().getId().equals(currentUser.getId());
    boolean isAdmin =
        authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!isOwner && !isAdmin) {
      throw new AppException(ErrorCode.ADDRESS_ACCESS_DENIED);
    }

    if (addressRepository.existsByPhoneNumberAndIdNot(request.getPhoneNumber(), id)) {
      throw new AppException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
    }

    address.setStreet(request.getStreet());
    address.setCity(request.getCity());
    address.setZip(request.getZip());
    address.setWard(request.getWard());
    address.setDistrict(request.getDistrict());
    address.setDetailAddress(request.getDetailAddress());
    address.setPhoneNumber(request.getPhoneNumber());

    Address savedAddress = addressRepository.save(address);
    log.info("Address updated successfully with ID: {}", savedAddress.getId());

    return addressMapper.toAddressResponse(savedAddress);
  }

  @Override
  @Transactional
  public void deleteAddress(Long id) {
    log.info("Deleting address with ID: {}", id);

    Address address =
        addressRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    User currentUser =
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    boolean isOwner = address.getUser().getId().equals(currentUser.getId());
    boolean isAdmin =
        authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!isOwner && !isAdmin) {
      throw new AppException(ErrorCode.ADDRESS_ACCESS_DENIED);
    }

    addressRepository.deleteById(id);
    log.info("Address deleted successfully with ID: {}", id);
  }

  @Override
  public AddressResponse getAddressById(Long id) {
    log.info("Getting address with ID: {}", id);

    Address address =
        addressRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

    return addressMapper.toAddressResponse(address);
  }

  @Override
  public Page<AddressResponse> getAllAddresses(Pageable pageable) {
    log.info("Getting all addresses with pagination");

    Page<Address> addresses = addressRepository.findAll(pageable);
    return addresses.map(addressMapper::toAddressResponse);
  }

  @Override
  public List<AddressResponse> getAddressesByUserId(Long userId) {
    log.info("Getting addresses for user ID: {}", userId);

    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    List<Address> addresses = addressRepository.findByUserId(userId);
    return addresses.stream().map(addressMapper::toAddressResponse).toList();
  }

  @Override
  public Page<AddressResponse> getMyAddresses(String city, Pageable pageable) {
    log.info("Getting addresses for current user with pagination and city filter: {}", city);

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    User currentUser =
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    Page<Address> addresses;
    if (city != null && !city.trim().isEmpty()) {
      addresses =
          addressRepository.findByUserIdAndCityContainingIgnoreCase(
              currentUser.getId(), city.trim(), pageable);
    } else {
      addresses = addressRepository.findByUserId(currentUser.getId(), pageable);
    }

    return addresses.map(addressMapper::toAddressResponse);
  }
}
