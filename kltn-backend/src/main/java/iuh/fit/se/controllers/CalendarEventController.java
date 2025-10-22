package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CalendarEventRequest;
import iuh.fit.se.dtos.responses.CalendarEventResponse;
import iuh.fit.se.services.interfaces.ICalendarEventService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/calendar-events")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CalendarEventController {

  ICalendarEventService calendarEventService;

  @GetMapping("/my")
  public APIResponse<List<CalendarEventResponse>> getMyEvents(
      @RequestParam(value = "start", required = false)
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime start,
      @RequestParam(value = "end", required = false)
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime end) {
    return APIResponse.<List<CalendarEventResponse>>builder()
        .result(calendarEventService.getMyEvents(start, end))
        .message("Fetched events successfully !")
        .build();
  }

  @GetMapping("/all")
  public APIResponse<List<CalendarEventResponse>> getAllEvents(
      @RequestParam(value = "start", required = false)
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime start,
      @RequestParam(value = "end", required = false)
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime end) {
    return APIResponse.<List<CalendarEventResponse>>builder()
        .result(calendarEventService.getAllEvents(start, end))
        .message("Fetched all events successfully !")
        .build();
  }

  @PostMapping
  public APIResponse<CalendarEventResponse> create(
      @Valid @RequestBody CalendarEventRequest request) {
    return APIResponse.<CalendarEventResponse>builder()
        .result(calendarEventService.create(request))
        .message("Created event successfully !")
        .build();
  }

  @PutMapping("/{id}")
  public APIResponse<CalendarEventResponse> update(
      @PathVariable Long id, @Valid @RequestBody CalendarEventRequest request) {
    return APIResponse.<CalendarEventResponse>builder()
        .result(calendarEventService.update(id, request))
        .message("Updated event successfully !")
        .build();
  }

  @DeleteMapping("/{id}")
  public APIResponse<Void> delete(@PathVariable Long id) {
    calendarEventService.delete(id);
    return APIResponse.<Void>builder().message("Deleted event successfully !").build();
  }
}
