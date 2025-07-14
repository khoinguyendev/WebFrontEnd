import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../../redux/cartSlice";

const NotifyOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    dispatch(clearCart());
    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
                Đơn hàng của bạn đã được đặt thành công
            </h2>
            <p className="text-gray-700 mb-6">
                Vui lòng chờ người bán xác nhận đơn hàng của bạn.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                >
                    Tiếp tục mua sắm
                </button>
                <button
                    onClick={() => navigate("/thong-tin-cua-toi")}
                    className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition"
                >
                    Xem đơn hàng
                </button>
            </div>
        </div>
    );
};

export default NotifyOrder;
