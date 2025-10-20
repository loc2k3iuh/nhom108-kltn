package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.se.enums.EventPriority;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CalendarEventResponse {
  private Long id;
  private String title;
  private String description;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime startTime;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime endTime;

  private Boolean allDay;
  private EventPriority priority;

  private Long createdById;
  private String createdByUsername;
}
