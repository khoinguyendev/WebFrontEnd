import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../../../redux/cartSlice";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";

const NofifyVNPay = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const orderId = searchParams.get("vnp_OrderInfo");

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (vnp_ResponseCode === "00" && orderId) {
        try {
          await axios.put(`${SERVER_HOST}/orders/${orderId}`, {
            paymentStatus: "Đã thanh toán",
            status: "PENDING",
          });
          dispatch(clearCart());
          setIsSuccess(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setIsSuccess(false);
      }
    };

    updatePaymentStatus();
  }, [vnp_ResponseCode, orderId, dispatch]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      {vnp_ResponseCode == "00" ? (
        <>
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            Thanh toán đơn hàng thành công
          </h2>
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
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Thanh toán đơn hàng không thành công
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            Quay về trang chủ
          </button>
        </>
      )}
    </div>
  );
};

export default NofifyVNPay;
