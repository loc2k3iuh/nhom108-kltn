import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { getThisMonthStats, DashboardStatsResponse } from "@/services/statisticsService";

export default function EcommerceMetrics() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getThisMonthStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Khách hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.totalCustomers?.toLocaleString() || '0'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats?.newCustomers || 0} khách hàng mới
            </p>
          </div>
          {stats && stats.newCustomerRate > 0 && (
            <Badge color={stats.newCustomerRate >= 10 ? "success" : "warning"}>
              <ArrowUpIcon />
              {stats.newCustomerRate.toFixed(2)}%
            </Badge>
          )}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.totalOrders?.toLocaleString() || '0'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats?.completedOrders || 0} hoàn thành
            </p>
          </div>

          {stats && stats.completedOrders !== undefined && stats.totalOrders !== undefined && stats.totalOrders > 0 && (
            <Badge color={stats.completedOrders / stats.totalOrders >= 0.7 ? "success" : "error"}>
              {stats.completedOrders / stats.totalOrders >= 0.7 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
