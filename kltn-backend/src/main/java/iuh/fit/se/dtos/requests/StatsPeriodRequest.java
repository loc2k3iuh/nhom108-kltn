package iuh.fit.se.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatsPeriodRequest {
  String period; // DAY, MONTH, YEAR
  String startDate; // Format: yyyy-MM-dd
  String endDate; // Format: yyyy-MM-dd
  Integer year;
  Integer month;
  Integer day;
}
