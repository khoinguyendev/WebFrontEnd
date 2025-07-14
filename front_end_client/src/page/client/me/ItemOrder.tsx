import moment from "moment";
import { IOrder } from "../../../types/Order";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../../components/admin/ButtonLoading";
const status = {
    PENDING: "Chờ xác nhận",
    PREPARING: "Đang chuẩn bị",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELED: "Đã hủy",
};

const ItemOrder = ({ order, deleteSuccess }: { order: IOrder, deleteSuccess: (id: string) => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleCancel = async (id: string) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (!confirmed) return;

        try {
            setIsLoading(true);
            const data = {
                status: "CANCELED"
            }
            await axios.put(`${SERVER_HOST}/orders/${id}`, data);
            toast.success("Hủy đơn thành công");
            deleteSuccess(id);
        } catch (error) {
            console.log(error);
            toast.error("Hủy đơn không thành công");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div key={order.id} className="border rounded-lg shadow-sm p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-sm text-gray-500">Mã đơn: <span className="font-bold">#{order.id}</span></p>
                    <p className="text-sm text-gray-500">Giờ đặt: <span className="font-bold">{moment(order.createdAt).format("HH:mm:ss")}</span></p>
                    <p className="text-sm text-gray-500">Phương thức thanh toán: <span className="font-bold">{order.paymentMethod}</span></p>
                    <p className="text-sm text-gray-500">Trạng thái thanh toán: <span className="font-bold">{order.paymentStatus}</span></p>

                </div>
                <div>
                    {order.paymentMethod == "CASH" && order.status == "PENDING" && <button
                        disabled={isLoading}
                        onClick={() => handleCancel(order.id)}
                        className="border text-sm border-primary text-primary px-2 py-1 mb-1 rounded hover:bg-primary hover:text-white transition"
                    >
                        {isLoading ? <ButtonLoading /> : "Hủy đơn"}
                    </button>}
                    <p className={`text-sm font-medium ${order.status!="CANCELED"?'text-green-500':'text-primary'}`}>{status[order.status as keyof typeof status]}</p>

                </div>
            </div>

            <div className="w-full overflow-auto mt-4">
                <table className="w-full border border-gray-200 text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-2">Sản phẩm</th>
                            <th className="px-4 py-2">SL</th>
                            <th className="px-4 py-2">Giá</th>
                            <th className="px-4 py-2">Thành tiền</th>
                            {order.status === "DELIVERED" && <th className="px-4 py-2">Đánh giá</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderDetails.map((detail) => {
                            const imageUrl = JSON.parse(detail.product.image)[0];
                            return (
                                <tr key={detail.id} className="border-b">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        <img src={imageUrl} alt={detail.product.name} className="w-12 h-12 object-cover rounded" />
                                        <span>{detail.product.name}</span>
                                    </td>
                                    <td className="px-4 py-2">{detail.quantity}</td>
                                    <td className="px-4 py-2">{detail.price.toLocaleString()}đ</td>
                                    <td className="px-4 py-2">{(detail.price * detail.quantity).toLocaleString()}đ</td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-right font-semibold text-gray-700">Phí vận chuyển: {order.shippingPrice.toLocaleString()}đ</div>
            <div className="text-right font-semibold text-gray-700">Tiền hàng: {order.productPrice.toLocaleString()}đ</div>
            <div className="text-right font-semibold text-gray-700 text-primary">Tổng tiền: {order.totalPrice.toLocaleString()}đ</div>
        </div>
    )
}

export default ItemOrder