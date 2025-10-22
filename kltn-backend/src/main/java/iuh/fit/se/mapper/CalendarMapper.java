package iuh.fit.se.mapper;


import iuh.fit.se.dtos.responses.CalendarEventResponse;
import iuh.fit.se.entities.CalendarEvent;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CalendarMapper {
    CalendarEventResponse toCalendarResponse(CalendarEvent calendarEvent);
}
