import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearCart } from '../../../redux/cartSlice';
import axios from 'axios';
import { SERVER_HOST } from '../../../config/Url';

const NofifyMomo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const resultCode = searchParams.get("resultCode");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (resultCode === "0" && orderId) {
        try {
          await axios.put(`${SERVER_HOST}/orders/${orderId}`, {
            paymentStatus: "Đã thanh toán",
            status:"PENDING",
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
  }, [resultCode, orderId, dispatch]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      {resultCode == "0" ? (
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

export default NofifyMomo;
