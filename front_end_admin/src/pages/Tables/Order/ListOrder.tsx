import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import PageMeta from "../../../components/common/PageMeta"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import { IOrder } from "../../../types/Order";
import Pagination from "../../../components/ui/pagination/Pagination";
import SnipperLoading from "../../../utils/SnipperLoading";
import ItemOrder from "./ItemOrder";
const tabs = [
    { id: "PENDING", lable: "Chờ xác nhận" },
    { id: "PREPARING", lable: "Đang chuẩn bị" },
    { id: "DELIVERING", lable: "Đang giao" },
    { id: "DELIVERED", lable: "Đã giao" },
    { id: "CANCELED", lable: "Đã hủy" },

];
const ListOrder = () => {
    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [activeTab, setActiveTab] = useState("PENDING");

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/orders?status=${activeTab}&sort=id,desc&page=${pageCurrent - 1}`);
                setOrders(response.data.data.content);
                console.log(response);
                setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeTab, pageCurrent]);
    const handleSetActive = (id: string) => {
        setActiveTab(id);
    };
    const deleteSuccess = async (id: string) => {
        setOrders(orders.filter((order) => order.id !== id));

    };
    return (
        <>
            <PageMeta
                title="Đơn hàng"
                description="Danh sách đơn hàng"
            />
            <PageBreadcrumb pageTitle="Danh sách đơn hàng" />
            {/* <div className="my-3">
                <Link to={"/tables/category/add"} className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                    Thêm danh mục
                </Link>
            </div> */}
            <div className="w-full mb-1">
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                        {tabs.map((tab) => (
                            <li key={tab.id} className="me-2" role="presentation">
                                <button
                                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === tab.id
                                        ? "text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500"
                                        : "text-gray-500 hover:text-gray-600 border-transparent hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                        }`}
                                    onClick={() => handleSetActive(tab.id)}
                                    type="button"
                                >
                                    {tab.lable}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        STT
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Mã đơn hàng
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Thông tin người đặt
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Giá trị đơn hàng
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Ngày đặt hàng
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Hành động
                                    </TableCell>

                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            {isLoading ? <SnipperLoading /> :
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {orders.map((order, index) => (
                                        <ItemOrder key={order.id} order={order} stt={index + 1} deleteSuccess={deleteSuccess}/>
                                    ))}
                                </TableBody>
                            }
                        </Table>
                    </div>
                </div>
                {totalPages != null && totalPages > 0 && <Pagination pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} totalPages={totalPages} />}

            </div>

        </>
    )
}

export default ListOrder