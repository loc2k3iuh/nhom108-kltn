package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CalendarEventRequest;
import iuh.fit.se.dtos.responses.CalendarEventResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ICalendarEventService {

  CalendarEventResponse create(CalendarEventRequest request);

  CalendarEventResponse update(Long id, CalendarEventRequest request);

  void delete(Long id);

  CalendarEventResponse getById(Long id);

  List<CalendarEventResponse> getMyEvents(LocalDateTime start, LocalDateTime end);

  // Convenience methods to fetch events by period
  List<CalendarEventResponse> getMyEventsByDay(LocalDate date);

  List<CalendarEventResponse> getMyEventsByWeek(LocalDate anyDateInWeek);

  List<CalendarEventResponse> getMyEventsByMonth(LocalDate anyDateInMonth);

  // Fetch events for all users
  List<CalendarEventResponse> getAllEvents(LocalDateTime start, LocalDateTime end);

  List<CalendarEventResponse> getAllEventsByDay(LocalDate date);

  List<CalendarEventResponse> getAllEventsByWeek(LocalDate anyDateInWeek);

  List<CalendarEventResponse> getAllEventsByMonth(LocalDate anyDateInMonth);
}
