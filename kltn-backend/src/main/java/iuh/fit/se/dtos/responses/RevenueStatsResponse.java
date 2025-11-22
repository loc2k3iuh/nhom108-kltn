package iuh.fit.se.dtos.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueStatsResponse {
  LocalDateTime date;
  BigDecimal revenue;
  BigDecimal profit;
  Long orderCount;
  String period; // DAY, MONTH, YEAR
}
