import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { SERVER_HOST } from "../../configs/UrlServer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RevenueChart() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filterType, setFilterType] = useState<"month" | "year">("month");
  const [displayLabel, setDisplayLabel] = useState("Tháng này");

  const [series, setSeries] = useState([{
    name: "Doanh thu", data: [] as any[],
  }]);
  const [categories, setCategories] = useState<string[]>([]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 310,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toLocaleString("vi-VN") + " ₫",
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val.toLocaleString()} ₫` },
    },
  };

  // Hàm dùng chung để fetch dữ liệu theo thời gian
  const fetchRevenueData = useCallback(async (query: string, type: "month" | "year") => {
    try {
      const res = await axios.get(`${SERVER_HOST}/statistics/revenue?${query}`);
      const data = res.data;

      const now = dayjs(selectedDate);
      const count = type === "year" ? 12 : now.daysInMonth();
      const labels = Array.from({ length: count }, (_, i) =>
        type === "year" ? `Tháng ${i + 1}` : `${i + 1}`
      );
      const revenueMap = new Map(data.map((item: any) => [item.timeUnit, item.totalRevenue]));

      const revenueData = labels.map((_, i) => revenueMap.get(i + 1) ?? 0);

      setCategories(labels);
      setSeries([{ name: "Doanh thu", data: revenueData }]);
    } catch (err) {
      console.error("Failed to fetch revenue data", err);
    }
  }, [selectedDate]);

  // Lấy dữ liệu mặc định: Tháng này
  useEffect(() => {
    const now = dayjs();
    const month = now.month() + 1;
    const year = now.year();
    fetchRevenueData(`month=${month}&year=${year}`, "month");
  }, [fetchRevenueData]);

  // Hàm áp dụng lọc
  const applyFilter = () => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    let query = "";
    if (filterType === "year") {
      query = `year=${year}`;
      setDisplayLabel(`Năm ${year}`);
    } else {
      query = `month=${month}&year=${year}`;
      setDisplayLabel(`Tháng ${month}/${year}`);
    }

    fetchRevenueData(query, filterType);
    setShowFilterModal(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Doanh thu theo {displayLabel}
        </h3>
        <button
          onClick={() => setShowFilterModal(true)}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Lọc
        </button>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Lọc</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Chọn kiểu lọc:
              </label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "month" | "year")}
              >
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Chọn thời gian:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat={filterType === "year" ? "yyyy" : "MM/yyyy"}
                showYearPicker={filterType === "year"}
                showMonthYearPicker={filterType === "month"}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setShowFilterModal(false)}
              >
                Đóng
              </button>
              <button
                onClick={applyFilter}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
