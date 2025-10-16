package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateSizeRequest;
import iuh.fit.se.dtos.responses.SizeResponse;
import iuh.fit.se.entities.Size;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.SizeMapper;
import iuh.fit.se.repositories.SizeRepository;
import iuh.fit.se.services.interfaces.ISizeService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeService implements ISizeService {

  SizeRepository sizeRepository;
  SizeMapper sizeMapper;

  @Override
  @Transactional
  public SizeResponse createSize(CreateSizeRequest request) {
    log.info("Creating size with name: {}", request.getName());

    Size size =
        Size.builder().name(request.getName()).description(request.getDescription()).build();

    Size savedSize = sizeRepository.save(size);
    log.info("Size created successfully with ID: {}", savedSize.getId());

    return sizeMapper.toSizeResponse(savedSize);
  }

  @Override
  @Transactional
  public SizeResponse updateSize(Long id, CreateSizeRequest request) {
    log.info("Updating size with ID: {}", id);

    Size size =
        sizeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

    size.setName(request.getName());
    size.setDescription(request.getDescription());

    Size savedSize = sizeRepository.save(size);
    log.info("Size updated successfully with ID: {}", savedSize.getId());

    return sizeMapper.toSizeResponse(savedSize);
  }

  @Override
  @Transactional
  public void deleteSize(Long id) {
    log.info("Deleting size with ID: {}", id);

    if (!sizeRepository.existsById(id)) {
      throw new AppException(ErrorCode.SIZE_NOT_FOUND);
    }

    sizeRepository.deleteById(id);
    log.info("Size deleted successfully with ID: {}", id);
  }

  @Override
  public SizeResponse getSizeById(Long id) {
    log.info("Getting size with ID: {}", id);

    Size size =
        sizeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

    return sizeMapper.toSizeResponse(size);
  }

  @Override
  public Page<SizeResponse> getAllSizes(Pageable pageable) {
    log.info("Getting all sizes with pagination");

    Page<Size> sizes = sizeRepository.findAll(pageable);
    return sizes.map(sizeMapper::toSizeResponse);
  }

  @Override
  public List<SizeResponse> getAllSizesWithoutPaging() {
    log.info("Getting all sizes without pagination");

    List<Size> sizes = sizeRepository.findAll();
    return sizes.stream().map(sizeMapper::toSizeResponse).toList();
  }
}
