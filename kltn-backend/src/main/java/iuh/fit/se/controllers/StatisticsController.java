package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.StatsPeriodRequest;
import iuh.fit.se.dtos.responses.DashboardStatsResponse;
import iuh.fit.se.dtos.responses.RevenueStatsResponse;
import iuh.fit.se.services.interfaces.IStatisticsService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Statistics", description = "Statistics and Dashboard APIs")
public class StatisticsController {

  IStatisticsService statisticsService;

  @GetMapping("/dashboard")
  @Operation(
      summary = "Get dashboard statistics",
      description =
          "Get comprehensive dashboard statistics for a specific period. "
              + "Supports custom date ranges or predefined periods.")
  public APIResponse<DashboardStatsResponse> getDashboardStats(
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate,
      @RequestParam(required = false) Integer year,
      @RequestParam(required = false) Integer month,
      @RequestParam(required = false) Integer day,
      @RequestParam(required = false) String period) {

    StatsPeriodRequest request =
        StatsPeriodRequest.builder()
            .startDate(startDate)
            .endDate(endDate)
            .year(year)
            .month(month)
            .day(day)
            .period(period)
            .build();

    DashboardStatsResponse stats = statisticsService.getDashboardStats(request);
    return APIResponse.<DashboardStatsResponse>builder()
        .code(HttpStatus.OK.value())
        .message("Dashboard statistics retrieved successfully")
        .result(stats)
        .build();
  }

  @GetMapping("/revenue")
  @Operation(
      summary = "Get revenue statistics",
      description =
          "Get revenue statistics grouped by day, month, or year. "
              + "Returns a list of revenue data points for the specified period.")
  public APIResponse<List<RevenueStatsResponse>> getRevenueStats(
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate,
      @RequestParam(required = false) String period) {

    StatsPeriodRequest request =
        StatsPeriodRequest.builder().startDate(startDate).endDate(endDate).period(period).build();

    List<RevenueStatsResponse> stats = statisticsService.getRevenueStats(request);
    return APIResponse.<List<RevenueStatsResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("Revenue statistics retrieved successfully")
        .result(stats)
        .build();
  }

  @GetMapping("/today")
  @Operation(
      summary = "Get today's statistics",
      description = "Get dashboard statistics for today (from midnight to current time)")
  public APIResponse<DashboardStatsResponse> getTodayStats() {
    DashboardStatsResponse stats = statisticsService.getTodayStats();
    return APIResponse.<DashboardStatsResponse>builder()
        .code(HttpStatus.OK.value())
        .message("Today's statistics retrieved successfully")
        .result(stats)
        .build();
  }

  @GetMapping("/this-month")
  @Operation(
      summary = "Get this month's statistics",
      description = "Get dashboard statistics for the current month (from 1st day to current date)")
  public APIResponse<DashboardStatsResponse> getThisMonthStats() {
    DashboardStatsResponse stats = statisticsService.getThisMonthStats();
    return APIResponse.<DashboardStatsResponse>builder()
        .code(HttpStatus.OK.value())
        .message("This month's statistics retrieved successfully")
        .result(stats)
        .build();
  }

  @GetMapping("/this-year")
  @Operation(
      summary = "Get this year's statistics",
      description =
          "Get dashboard statistics for the current year (from January 1st to current date)")
  public APIResponse<DashboardStatsResponse> getThisYearStats() {
    DashboardStatsResponse stats = statisticsService.getThisYearStats();
    return APIResponse.<DashboardStatsResponse>builder()
        .code(HttpStatus.OK.value())
        .message("This year's statistics retrieved successfully")
        .result(stats)
        .build();
  }
}
