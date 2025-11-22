package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateColorRequest;
import iuh.fit.se.dtos.responses.ColorResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IColorService {
  ColorResponse createColor(CreateColorRequest request);

  ColorResponse updateColor(Long id, CreateColorRequest request);

  void deleteColor(Long id);

  ColorResponse getColorById(Long id);

  Page<ColorResponse> getAllColors(Pageable pageable);

  List<ColorResponse> getAllColorsWithoutPaging();
}
