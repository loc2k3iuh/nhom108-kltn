package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CalendarEventRequest;
import iuh.fit.se.dtos.responses.CalendarEventResponse;
import java.time.LocalDateTime;
import java.util.List;

public interface ICalendarEventService {

    void delete(Long id);

  CalendarEventResponse create(CalendarEventRequest request);

  CalendarEventResponse update(Long id, CalendarEventRequest request);

  List<CalendarEventResponse> getMyEvents(LocalDateTime start, LocalDateTime end);

  List<CalendarEventResponse> getAllEvents(LocalDateTime start, LocalDateTime end);
}
