package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.se.enums.EventPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalendarEventRequest {

  @NotBlank(message = "Title cannot be empty !")
  private String title;

  private String description;

  @NotNull(message = "Start time is required !")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime startTime;

  @NotNull(message = "End time is required !")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime endTime;

  private Boolean allDay = false;

  @NotNull(message = "Priority is required !")
  private EventPriority priority;
}
