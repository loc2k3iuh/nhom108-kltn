package iuh.fit.se.dtos.responses;

import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardStatsResponse {
  // Revenue statistics
  BigDecimal totalRevenue;
  BigDecimal totalProfit;
  BigDecimal totalDiscount;
  BigDecimal totalShippingCost;

  // Order statistics
  Long totalOrders;
  Long pendingOrders;
  Long processingOrders;
  Long completedOrders;
  Long cancelledOrders;

  // Customer statistics
  Long totalCustomers;
  Long newCustomers;
  Double newCustomerRate;

  // Time period
  String period; // DAY, MONTH, YEAR
  String startDate;
  String endDate;
}
