package iuh.fit.se.mapper;


import iuh.fit.se.dtos.responses.CalendarEventResponse;
import iuh.fit.se.entities.CalendarEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CalendarMapper {

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.username", target = "createdByUsername")
    CalendarEventResponse toCalendarResponse(CalendarEvent calendarEvent);
}
