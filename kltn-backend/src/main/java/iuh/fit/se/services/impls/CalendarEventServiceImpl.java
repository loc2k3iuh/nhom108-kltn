package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CalendarEventRequest;
import iuh.fit.se.dtos.responses.CalendarEventResponse;
import iuh.fit.se.entities.CalendarEvent;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.CalendarMapper;
import iuh.fit.se.repositories.CalendarEventRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.ICalendarEventService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CalendarEventServiceImpl implements ICalendarEventService {

  CalendarEventRepository calendarEventRepository;
  UserRepository userRepository;
  CalendarMapper calendarMapper;

  @Override
  @Transactional
  public CalendarEventResponse create(CalendarEventRequest request) {
    User currentUser = getCurrentUser();
    validateTimes(request.getStartTime(), request.getEndTime());

    CalendarEvent event = new CalendarEvent();
    event.setTitle(request.getTitle());
    event.setDescription(request.getDescription());
    event.setStartTime(request.getStartTime());
    event.setEndTime(request.getEndTime());
    event.setAllDay(Boolean.TRUE.equals(request.getAllDay()));
    event.setPriority(request.getPriority());
    event.setCreatedBy(currentUser);

    CalendarEvent saved = calendarEventRepository.save(event);
    return calendarMapper.toCalendarResponse(saved);
  }

  @Override
  @Transactional
  public CalendarEventResponse update(Long id, CalendarEventRequest request) {
    User currentUser = getCurrentUser();
    validateTimes(request.getStartTime(), request.getEndTime());

    CalendarEvent event =
        calendarEventRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));

    ensureOwner(event, currentUser);

    Optional.ofNullable(request.getTitle()).filter(t -> !t.isBlank()).ifPresent(event::setTitle);
    Optional.ofNullable(request.getDescription()).ifPresent(event::setDescription);
    Optional.ofNullable(request.getStartTime()).ifPresent(event::setStartTime);
    Optional.ofNullable(request.getEndTime()).ifPresent(event::setEndTime);
    Optional.ofNullable(request.getAllDay()).ifPresent(event::setAllDay);
    Optional.ofNullable(request.getPriority()).ifPresent(event::setPriority);

    CalendarEvent saved = calendarEventRepository.save(event);
    return calendarMapper.toCalendarResponse(saved);
  }

  @Override
  @Transactional
  public void delete(Long id) {
    User currentUser = getCurrentUser();
    CalendarEvent event =
        calendarEventRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));
    ensureOwner(event, currentUser);
    calendarEventRepository.delete(event);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CalendarEventResponse> getMyEvents(LocalDateTime start, LocalDateTime end) {
    User currentUser = getCurrentUser();
    List<CalendarEvent> events;
    if (Objects.nonNull(start) && Objects.nonNull(end)) {
      validateTimes(start, end);
      events = calendarEventRepository.findOverlappingByUser(currentUser, start, end);
    } else {
      events = calendarEventRepository.findByCreatedByOrderByStartTimeAsc(currentUser);
    }
    return events.stream().map(calendarMapper::toCalendarResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<CalendarEventResponse> getAllEvents(LocalDateTime start, LocalDateTime end) {
    List<CalendarEvent> events;
    if (Objects.nonNull(start) && Objects.nonNull(end)) {
      validateTimes(start, end);
      events = calendarEventRepository.findOverlappingAll(start, end);
    } else {
      events = calendarEventRepository.findAllByOrderByStartTimeAsc();
    }
    return events.stream().map(calendarMapper::toCalendarResponse).collect(Collectors.toList());
  }

  private void validateTimes(LocalDateTime start, LocalDateTime end) {
    if (start == null || end == null) {
      throw new AppException(ErrorCode.INVALID_INPUT);
    }
    if (end.isBefore(start)) {
      throw new AppException(ErrorCode.INVALID_INPUT);
    }
  }

  private void ensureOwner(CalendarEvent event, User user) {
    if (!event.getCreatedBy().getId().equals(user.getId())) {
      throw new AppException(ErrorCode.ACCESS_DENIED);
    }
  }

  private User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }
    return userRepository
        .findByUsername(authentication.getName())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
  }


}
