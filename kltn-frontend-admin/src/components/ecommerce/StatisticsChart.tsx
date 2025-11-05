import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getRevenueStats, RevenueStatsResponse } from "@/services/statisticsService";

export default function StatisticsChart() {
  const [revenueData, setRevenueData] = useState<RevenueStatsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        let startDate = '';
        let endDate = '';
        let periodParam: 'DAY' | 'MONTH' | 'YEAR' = 'MONTH';

        if (period === 'day') {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 30);
          startDate = start.toISOString().split('T')[0];
          endDate = end.toISOString().split('T')[0];
          periodParam = 'DAY';
        } else if (period === 'month') {
          startDate = `${currentYear}-01-01`;
          endDate = `${currentYear}-12-31`;
          periodParam = 'MONTH';
        } else {
          startDate = `${currentYear - 4}-01-01`;
          endDate = `${currentYear}-12-31`;
          periodParam = 'YEAR';
        }
        
        const data = await getRevenueStats({
          startDate,
          endDate,
          period: periodParam
        });
        setRevenueData(data);
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueStats();
  }, [period]);

  // Process data based on period
  const getChartData = () => {
    if (period === 'day') {
      const labels: string[] = [];
      const revenueValues: number[] = [];
      const orderCounts: number[] = [];

      revenueData.forEach(item => {
        const date = new Date(item.date);
        labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        revenueValues.push(Number(item.revenue) / 1000000);
        orderCounts.push(Number(item.orderCount));
      });

      return { labels, revenueValues, orderCounts };
    } else if (period === 'month') {
      const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const revenueValues = new Array(12).fill(0);
      const orderCounts = new Array(12).fill(0);

      revenueData.forEach(item => {
        const date = new Date(item.date);
        const monthIndex = date.getMonth();
        revenueValues[monthIndex] = Number(item.revenue) / 1000000;
        orderCounts[monthIndex] = Number(item.orderCount);
      });

      return { labels: monthLabels, revenueValues, orderCounts };
    } else {
      const labels: string[] = [];
      const revenueValues: number[] = [];
      const orderCounts: number[] = [];

      revenueData.forEach(item => {
        const date = new Date(item.date);
        labels.push(date.getFullYear().toString());
        revenueValues.push(Number(item.revenue) / 1000000);
        orderCounts.push(Number(item.orderCount));
      });

      return { labels, revenueValues, orderCounts };
    }
  };

  const chartData = getChartData();

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465fff", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: "Doanh thu (triệu VNĐ)",
      },
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val.toFixed(2)} triệu VNĐ`,
      },
    },
  };
  
  const series = [
    {
      name: "Doanh thu",
      data: chartData.revenueValues,
    },
    {
      name: "Số đơn hàng",
      data: chartData.orderCounts,
    },
  ];

  const getPeriodTitle = () => {
    if (period === 'day') return 'Doanh thu 30 ngày gần đây';
    if (period === 'month') return `Doanh thu theo tháng (${new Date().getFullYear()})`;
    return 'Doanh thu theo năm';
  };

  const getButtonClass = (opt: 'day' | 'month' | 'year') =>
    period === opt
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";
  
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
          <div className="w-full">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="h-[310px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {getPeriodTitle()}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Thống kê doanh thu và số lượng đơn hàng
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
              onClick={() => setPeriod("day")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("day")}`}
            >
              Ngày
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("month")}`}
            >
              Tháng
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("year")}`}
            >
              Năm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
