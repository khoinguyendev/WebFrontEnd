import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import moment from "moment"; // dùng để format ngày

import SnipperLoading from "../../../components/admin/SnipperLoading";
import { IOrder } from "../../../types/Order";
import ItemOrder from "./ItemOrder";


const tabs = [
    { id: "PENDING", lable: "Chờ xác nhận" },
    { id: "PREPARING", lable: "Đang chuẩn bị" },
    { id: "DELIVERING", lable: "Đang giao" },
    { id: "DELIVERED", lable: "Đã giao" },
    { id: "CANCELED", lable: "Đã hủy" },

];
const ProfileOrder = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [activeTab, setActiveTab] = useState("PENDING");
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const handleSetActive = (id: string) => {
        setActiveTab(id);
    };
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/orders/by-me?status=${activeTab}`);
                const newOrders: IOrder[] = response.data.data.content;

                setOrders((prev) => (pageCurrent === 1 ? newOrders : [...prev, ...newOrders]));
                setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageCurrent, activeTab]);
    const deleteSuccess = async (id: string) => {
        setOrders(orders.filter((order) => order.id !== id));

    };
    // Gom nhóm theo ngày
    const groupedOrders = orders.reduce((groups: Record<string, IOrder[]>, order) => {
        const date = moment(order.createdAt).format("YYYY-MM-DD");
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(order);
        return groups;
    }, {});

    return (
        <div className="custom-container py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
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
            <div className="space-y-10">
                {Object.entries(groupedOrders).map(([date, orders]) => (
                    <div key={date}>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">{moment(date).format("DD/MM/YYYY")}</h3>
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <ItemOrder key={order.id} order={order} deleteSuccess={deleteSuccess} />
                            ))}
                        </div>
                    </div>
                ))}
                {/* {openReviewModal && (
          <ReviewModel
            setOpenModal={setOpenReviewModal}
            productName={selectedProductName}
            productId={selectedProductId}
          />
        )} */}
            </div>
            {isLoading && <SnipperLoading />}
            {totalPages !== null && totalPages > 0 && pageCurrent < totalPages && (
                <div className="flex justify-center">
                    <button
                        type="submit"
                        onClick={() => setPageCurrent((pre) => pre + 1)}
                        disabled={isLoading}
                        className="mt-3 gap-2 border border-1 border-primary text-gray1 font-medium py-2 px-4 rounded text-base"
                    >
                        Xem thêm
                    </button>
                </div>
            )}
            {!isLoading && orders.length === 0 && totalPages === 0 && <p className="text-center text-gray-500 mt-5">Không có đơn hàng nào</p>}{" "}
        </div>
    );
};

export default ProfileOrder;
