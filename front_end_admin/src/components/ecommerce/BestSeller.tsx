import { use, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { SERVER_HOST } from "../../configs/UrlServer";
import { urlList } from "../../utils/Format";

interface Product {
    productVariantId: number;
    productName: string;
    productImage: string;
    sku: string;
    totalSold: number;
}

export default function BestSeller() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filterType, setFilterType] = useState<"day" | "month" | "year">("year");
    const [show,setShow]=useState<string>("Hôm nay");
    const fetchBestSellers = async (dateParams: string = "year=2025") => {
        setLoading(true);
        try {
            const response = await axios.get<Product[]>(
                `${SERVER_HOST}/statistics/top-10-best-sellers?${dateParams}`
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch best sellers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // Lưu ý: getMonth() trả về 0-11
        const currentDay = now.getDate();

        // Tuỳ chọn kiểu lọc: chỉ năm, tháng/năm hoặc ngày/tháng/năm
        const defaultParams = `year=${currentYear}&month=${currentMonth}&day=${currentDay}`;

        fetchBestSellers(defaultParams);
    }, []);

    const applyFilter = () => {
        if (!selectedDate) return;

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        let query = "";

        if (filterType === "year") {
            query = `year=${year}`;
            setShow(`Năm ${year}`);
        } else if (filterType === "month") {
            query = `year=${year}&month=${month}`;
            setShow(`Tháng ${month}/${year}`);
        } else {
            query = `year=${year}&month=${month}&day=${day}`;
            setShow(`Ngày ${day}/${month}/${year}`);
        }

        fetchBestSellers(query);
        setShowFilterModal(false);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Top 10 sản phẩm bán chạy nhất
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Lọc
                    </button>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        {show}
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
            ) : products.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có sản phẩm bán chạy nào.</p>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">Sản phẩm</TableCell>
                                <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">Mã sản phẩm</TableCell>
                                <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">Đã bán</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {products.map((product) => (
                                <TableRow key={product.productVariantId}>
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                <img
                                                    src={urlList(product.productImage)}
                                                    alt={product.productName}
                                                    className="h-[50px] w-[50px] object-cover"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {product.productName}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                                        {product.totalSold}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-opacity-40 backdrop-blur-sm backdrop-brightness-95">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Lọc theo thời gian</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Chọn kiểu lọc:
                            </label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                            >
                                <option value="day">Ngày cụ thể</option>
                                <option value="month">Tháng </option>
                                <option value="year">Năm</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Chọn thời gian:
                            </label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat={
                                    filterType === "year"
                                        ? "yyyy"
                                        : filterType === "month"
                                            ? "MM/yyyy"
                                            : "dd/MM/yyyy"
                                }
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
