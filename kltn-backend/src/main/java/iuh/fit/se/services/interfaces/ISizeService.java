package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateSizeRequest;
import iuh.fit.se.dtos.responses.SizeResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ISizeService {
  SizeResponse createSize(CreateSizeRequest request);

  SizeResponse updateSize(Long id, CreateSizeRequest request);

  void deleteSize(Long id);

  SizeResponse getSizeById(Long id);

  Page<SizeResponse> getAllSizes(Pageable pageable);

  List<SizeResponse> getAllSizesWithoutPaging();
}
