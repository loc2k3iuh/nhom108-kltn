package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.StatsPeriodRequest;
import iuh.fit.se.dtos.responses.DashboardStatsResponse;
import iuh.fit.se.dtos.responses.RevenueStatsResponse;
import java.util.List;

public interface IStatisticsService {

  /**
   * Get dashboard statistics for a specific period
   *
   * @param request Period request with date range
   * @return Dashboard statistics
   */
  DashboardStatsResponse getDashboardStats(StatsPeriodRequest request);

  /**
   * Get revenue statistics grouped by period (day/month/year)
   *
   * @param request Period request with date range
   * @return List of revenue statistics
   */
  List<RevenueStatsResponse> getRevenueStats(StatsPeriodRequest request);

  /**
   * Get today's statistics
   *
   * @return Dashboard statistics for today
   */
  DashboardStatsResponse getTodayStats();

  /**
   * Get this month's statistics
   *
   * @return Dashboard statistics for this month
   */
  DashboardStatsResponse getThisMonthStats();

  /**
   * Get this year's statistics
   *
   * @return Dashboard statistics for this year
   */
  DashboardStatsResponse getThisYearStats();
}
