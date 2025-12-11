package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.StatsPeriodRequest;
import iuh.fit.se.dtos.responses.DashboardStatsResponse;
import iuh.fit.se.dtos.responses.RevenueStatsResponse;
import iuh.fit.se.dtos.responses.TopProductResponse;
import iuh.fit.se.enums.OrderStatus;
import iuh.fit.se.repositories.OrderDetailRepository;
import iuh.fit.se.repositories.OrderRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IStatisticsService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticsServiceImpl implements IStatisticsService {

  OrderRepository orderRepository;
  OrderDetailRepository orderDetailRepository;
  UserRepository userRepository;

  @Override
  public DashboardStatsResponse getDashboardStats(StatsPeriodRequest request) {
    LocalDateTime startDate;
    LocalDateTime endDate;

    if (request.getStartDate() != null && request.getEndDate() != null) {
      // Use custom date range
      startDate = LocalDate.parse(request.getStartDate()).atStartOfDay();
      endDate = LocalDate.parse(request.getEndDate()).atTime(LocalTime.MAX);
    } else if (request.getYear() != null) {
      // Use year
      if (request.getMonth() != null) {
        // Specific month
        YearMonth yearMonth = YearMonth.of(request.getYear(), request.getMonth());
        startDate = yearMonth.atDay(1).atStartOfDay();
        endDate = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);
      } else {
        // Whole year
        startDate = LocalDate.of(request.getYear(), 1, 1).atStartOfDay();
        endDate = LocalDate.of(request.getYear(), 12, 31).atTime(LocalTime.MAX);
      }
    } else {
      // Default to current month
      YearMonth currentMonth = YearMonth.now();
      startDate = currentMonth.atDay(1).atStartOfDay();
      endDate = currentMonth.atEndOfMonth().atTime(LocalTime.MAX);
    }

    return calculateStats(startDate, endDate, determinePeriod(request));
  }

  @Override
  public List<RevenueStatsResponse> getRevenueStats(StatsPeriodRequest request) {
    LocalDateTime startDate;
    LocalDateTime endDate;

    if (request.getStartDate() != null && request.getEndDate() != null) {
      startDate = LocalDate.parse(request.getStartDate()).atStartOfDay();
      endDate = LocalDate.parse(request.getEndDate()).atTime(LocalTime.MAX);
    } else {
      // Default to last 30 days
      endDate = LocalDateTime.now();
      startDate = endDate.minusDays(30);
    }

    String period = determinePeriod(request);
    List<Object[]> results;

    switch (period.toUpperCase()) {
      case "DAY":
        results = orderRepository.getRevenueByDay(startDate, endDate);
        return mapDailyRevenueResults(results);
      case "MONTH":
        results = orderRepository.getRevenueByMonth(startDate, endDate);
        return mapMonthlyRevenueResults(results);
      case "YEAR":
        results = orderRepository.getRevenueByYear(startDate, endDate);
        return mapYearlyRevenueResults(results);
      default:
        results = orderRepository.getRevenueByDay(startDate, endDate);
        return mapDailyRevenueResults(results);
    }
  }

  @Override
  public DashboardStatsResponse getTodayStats() {
    LocalDateTime startDate = LocalDate.now().atStartOfDay();
    LocalDateTime endDate = LocalDateTime.now();
    return calculateStats(startDate, endDate, "DAY");
  }

  @Override
  public DashboardStatsResponse getThisMonthStats() {
    YearMonth currentMonth = YearMonth.now();
    LocalDateTime startDate = currentMonth.atDay(1).atStartOfDay();
    LocalDateTime endDate = LocalDateTime.now();
    return calculateStats(startDate, endDate, "MONTH");
  }

  @Override
  public DashboardStatsResponse getThisYearStats() {
    LocalDateTime startDate = LocalDate.of(LocalDate.now().getYear(), 1, 1).atStartOfDay();
    LocalDateTime endDate = LocalDateTime.now();
    return calculateStats(startDate, endDate, "YEAR");
  }

  private DashboardStatsResponse calculateStats(
      LocalDateTime startDate, LocalDateTime endDate, String period) {

    // Calculate revenue metrics
    BigDecimal totalRevenue = orderRepository.getTotalRevenue(startDate, endDate);
    BigDecimal totalDiscount = orderRepository.getTotalDiscount(startDate, endDate);
    BigDecimal totalShippingCost = orderRepository.getTotalShippingCost(startDate, endDate);

    // Calculate profit (revenue - discount - shipping cost)
    BigDecimal totalProfit = totalRevenue.subtract(totalDiscount).subtract(totalShippingCost);

    // Count orders by status
    Long totalOrders = orderRepository.countByCreatedAtBetween(startDate, endDate);
    Long pendingOrders =
        orderRepository.countByOrderStatusAndCreatedAtBetween(
            OrderStatus.PENDING, startDate, endDate);
    Long processingOrders =
        orderRepository.countByOrderStatusAndCreatedAtBetween(
            OrderStatus.PROCESSING, startDate, endDate);
    Long completedOrders =
        orderRepository.countByOrderStatusAndCreatedAtBetween(
            OrderStatus.COMPLETED, startDate, endDate);
    Long cancelledOrders =
        orderRepository.countByOrderStatusAndCreatedAtBetween(
            OrderStatus.CANCELLED, startDate, endDate);

    // Calculate customer metrics
    Long totalCustomers = userRepository.countCustomers();
    Date startDateUtil = convertToDate(startDate);
    Date endDateUtil = convertToDate(endDate);
    Long newCustomers = userRepository.countNewCustomers(startDateUtil, endDateUtil);

    Double newCustomerRate = 0.0;
    if (totalCustomers > 0) {
      newCustomerRate = (newCustomers.doubleValue() / totalCustomers.doubleValue() * 100);
      newCustomerRate = Math.round(newCustomerRate * 100.0) / 100.0; // Round to 2 decimal places
    }

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    return DashboardStatsResponse.builder()
        .totalRevenue(totalRevenue)
        .totalProfit(totalProfit)
        .totalDiscount(totalDiscount)
        .totalShippingCost(totalShippingCost)
        .totalOrders(totalOrders)
        .pendingOrders(pendingOrders)
        .processingOrders(processingOrders)
        .completedOrders(completedOrders)
        .cancelledOrders(cancelledOrders)
        .totalCustomers(totalCustomers)
        .newCustomers(newCustomers)
        .newCustomerRate(newCustomerRate)
        .period(period)
        .startDate(startDate.format(formatter))
        .endDate(endDate.format(formatter))
        .build();
  }

  private String determinePeriod(StatsPeriodRequest request) {
    if (request.getPeriod() != null) {
      return request.getPeriod().toUpperCase();
    }
    if (request.getDay() != null) {
      return "DAY";
    }
    if (request.getMonth() != null) {
      return "MONTH";
    }
    if (request.getYear() != null) {
      return "YEAR";
    }
    return "DAY";
  }

  private List<RevenueStatsResponse> mapDailyRevenueResults(List<Object[]> results) {
    List<RevenueStatsResponse> responses = new ArrayList<>();
    for (Object[] result : results) {
      LocalDate date = ((java.sql.Date) result[0]).toLocalDate();
      BigDecimal revenue = (BigDecimal) result[1];
      Long orderCount = ((Number) result[2]).longValue();

      responses.add(
          RevenueStatsResponse.builder()
              .date(date.atStartOfDay())
              .revenue(revenue)
              .profit(revenue.multiply(BigDecimal.valueOf(0.8))) // Simplified profit calculation
              .orderCount(orderCount)
              .period("DAY")
              .build());
    }
    return responses;
  }

  private List<RevenueStatsResponse> mapMonthlyRevenueResults(List<Object[]> results) {
    List<RevenueStatsResponse> responses = new ArrayList<>();
    for (Object[] result : results) {
      Integer year = (Integer) result[0];
      Integer month = (Integer) result[1];
      BigDecimal revenue = (BigDecimal) result[2];
      Long orderCount = ((Number) result[3]).longValue();

      LocalDateTime date = LocalDate.of(year, month, 1).atStartOfDay();

      responses.add(
          RevenueStatsResponse.builder()
              .date(date)
              .revenue(revenue)
              .profit(revenue.multiply(BigDecimal.valueOf(0.8)))
              .orderCount(orderCount)
              .period("MONTH")
              .build());
    }
    return responses;
  }

  private List<RevenueStatsResponse> mapYearlyRevenueResults(List<Object[]> results) {
    List<RevenueStatsResponse> responses = new ArrayList<>();
    for (Object[] result : results) {
      Integer year = (Integer) result[0];
      BigDecimal revenue = (BigDecimal) result[1];
      Long orderCount = ((Number) result[2]).longValue();

      LocalDateTime date = LocalDate.of(year, 1, 1).atStartOfDay();

      responses.add(
          RevenueStatsResponse.builder()
              .date(date)
              .revenue(revenue)
              .profit(revenue.multiply(BigDecimal.valueOf(0.8)))
              .orderCount(orderCount)
              .period("YEAR")
              .build());
    }
    return responses;
  }

  private Date convertToDate(LocalDateTime localDateTime) {
    return java.sql.Timestamp.valueOf(localDateTime);
  }

  @Override
  public List<TopProductResponse> getTop10BestSellingProducts() {
    List<Object[]> results = orderDetailRepository.findTop10BestSellingProducts();
    List<TopProductResponse> responses = new ArrayList<>();

    for (Object[] result : results) {
      Long productId = ((Number) result[0]).longValue();
      String productName = (String) result[1];
      String imageUrl = (String) result[2];
      Long totalQuantitySold = ((Number) result[3]).longValue();
      Double basePrice = result[4] != null ? ((Number) result[4]).doubleValue() : null;
      String categoryName = (String) result[5];
      String brandName = (String) result[6];

      responses.add(
          TopProductResponse.builder()
              .productId(productId)
              .productName(productName)
              .imageUrl(imageUrl)
              .totalQuantitySold(totalQuantitySold)
              .basePrice(basePrice)
              .categoryName(categoryName)
              .brandName(brandName)
              .build());
    }

    return responses;
  }
}
