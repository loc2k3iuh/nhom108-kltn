package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateColorRequest;
import iuh.fit.se.dtos.responses.ColorResponse;
import iuh.fit.se.entities.Color;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.ColorMapper;
import iuh.fit.se.repositories.ColorRepository;
import iuh.fit.se.services.interfaces.IColorService;
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
public class ColorService implements IColorService {

  ColorRepository colorRepository;
  ColorMapper colorMapper;

  @Override
  @Transactional
  public ColorResponse createColor(CreateColorRequest request) {
    log.info("Creating color with name: {}", request.getName());

    Color color =
        Color.builder().name(request.getName()).description(request.getDescription()).build();

    Color savedColor = colorRepository.save(color);
    log.info("Color created successfully with ID: {}", savedColor.getId());

    return colorMapper.toColorResponse(savedColor);
  }

  @Override
  @Transactional
  public ColorResponse updateColor(Long id, CreateColorRequest request) {
    log.info("Updating color with ID: {}", id);

    Color color =
        colorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));

    color.setName(request.getName());
    color.setDescription(request.getDescription());

    Color savedColor = colorRepository.save(color);
    log.info("Color updated successfully with ID: {}", savedColor.getId());

    return colorMapper.toColorResponse(savedColor);
  }

  @Override
  @Transactional
  public void deleteColor(Long id) {
    log.info("Deleting color with ID: {}", id);

    if (!colorRepository.existsById(id)) {
      throw new AppException(ErrorCode.COLOR_NOT_FOUND);
    }

    colorRepository.deleteById(id);
    log.info("Color deleted successfully with ID: {}", id);
  }

  @Override
  public ColorResponse getColorById(Long id) {
    log.info("Getting color with ID: {}", id);

    Color color =
        colorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));

    return colorMapper.toColorResponse(color);
  }

  @Override
  public Page<ColorResponse> getAllColors(Pageable pageable) {
    log.info("Getting all colors with pagination");

    Page<Color> colors = colorRepository.findAll(pageable);
    return colors.map(colorMapper::toColorResponse);
  }

  @Override
  public List<ColorResponse> getAllColorsWithoutPaging() {
    log.info("Getting all colors without pagination");

    List<Color> colors = colorRepository.findAll();
    return colors.stream().map(colorMapper::toColorResponse).toList();
  }
}
