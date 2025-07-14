import Bread from "../../components/client/Bread";
import { formatCurrency } from "../../util/Format";
import Address from "../../components/client/Address";
import { useLocation, useNavigate } from "react-router-dom";
import { ICartItem } from "../../types/CartItem";
import ItemPayment from "./payment/ItemPayment";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import toast from "react-hot-toast";
import ButtonLoading from "../../components/admin/ButtonLoading";
import { IAddressStore } from "../../types/AddressStore.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.tsx";
import { IUserAddress } from "../../types/UserAddress.ts";
import { add } from "lodash";
const Payment = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state || !location.state.selectedCartItems) {
    navigate("/");
  }
  const selectedCartItems: ICartItem[] = location.state?.selectedCartItems || [];
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH'); // default: cash on delivery
  const [isLoading, setIsLoading] = useState(false);
  const [addressStore, setAddressStore] = useState<IAddressStore | null>(null);
  const [address, setAddress] = useState("");
  const [shipInfo, setShipInfo] = useState({
    provinceId: 0,
    provinceName: "",
    districtId: 0,
    districtName: "",
    wardId: 0,
    wardName: "",
    phone: "",
    name: "",
    address: "",
    email: "",
    note: ""
  });
  const [totalShipping, setTotalShipping] = useState<number>(0);


  const calculateTotalPrice = () => {
    return selectedCartItems.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);
  };
  const handleDatHang = async () => {
    if (!handleCheckLoi()) return;
    const confirmed = window.confirm("Bạn có chắc chắn muốn đặt hàng không?");
    if (!confirmed) return;

    const productPrice = calculateTotalPrice();
    const data = {
      totalPrice: productPrice + totalShipping,
      shippingPrice: totalShipping,
      productPrice: productPrice,
      userId: user?.id,
      status: "PENDING",
      phone: shipInfo.phone,
      name: shipInfo.name,
      email: shipInfo.email,
      note: shipInfo.note,
      address: address + ", " + shipInfo.wardName + ", " + shipInfo.districtName + ", " + shipInfo.provinceName,
      paymentMethod: paymentMethod,
      orderDetails: selectedCartItems.map((item) => ({
        productVariantId: item.variantId,
        quantity: item.quantity,
        price: item.sale ? item.priceSale : item.price,
      }))
    };
    console.log(data);
    setIsLoading(true);
    try {
      const response = await axios.post(`${SERVER_HOST}/orders?paymentMethod=${paymentMethod}`, data);
      console.log(response);
      if (paymentMethod == "CASH") {
        navigate("/dat-hang-thanh-cong")
        toast.success('Đặt hàng thành công');

      } else if (paymentMethod == "MOMO") window.location.href = response.data.data.payUrl;
      else if (paymentMethod == "VNPAY") window.location.href = response.data.data.paymentUrl;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckLoi = () => {
    console.log(shipInfo);
    if (shipInfo.wardId === 0 || shipInfo.wardName === "" || shipInfo.districtId === 0 || shipInfo.districtName === ""|| shipInfo.provinceId === 0 || shipInfo.provinceName === "" || shipInfo.phone === "" || shipInfo.name === "") {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return false;
    }
    const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    if (!vietnamPhoneRegex.test(shipInfo.phone)) {
      toast.error("Số điện thoại không hợp lệ.");
      return false;
    }
    return true;
  }
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_HOST}/address-store/1`);
        const data: IAddressStore = response.data;
        setAddressStore(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
   
  return (
    <div className="min-h-[300px]">
      <div className="custom-container py-3">
        <Bread title="Thanh toán" />
        <div className="my-4">
          <h3 className="text-gray1 font-bold text-xl uppercase ">Trang thanh toán</h3>
        </div>
        <hr className="border border-primary" />

        <div className="cart grid grid-cols-12 my-3 gap-3">
          <div className="col-span-9 grid grid-cols-1 text-sm items-start">

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                  <th scope="col" className="px-6 py-3">
                    Thông tin sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Đơn giá
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCartItems.map((item: ICartItem) => (
                  <ItemPayment
                    key={item.variantId}
                    cart={item}
                  />

                ))}
              </tbody>
            </table>

          </div>
          <div className="col-span-3">
            <div className="mb-2">
              <h3 className="text-gray1 font-bold">Được gửi từ: </h3>
              <div>{addressStore?.districtName}, {addressStore?.provinceName}</div>
            </div>
            <div className="mb-3">
              <h3 className="text-gray1 font-bold mb-2">Thông tin giao hàng</h3>
              <Address setTotalShipping={setTotalShipping} setAddress={setAddress} address={address} setShipInfo={setShipInfo} />
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-gray1">Phí vận chuyển:</span>
                <span className="text-primary font-bold">{formatCurrency(totalShipping)}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-gray1">Tiền hàng:</span>
                <span className="text-primary font-bold">{formatCurrency(calculateTotalPrice())}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray1">Tổng tiền:</span>
              <span className="text-primary font-bold">{formatCurrency(calculateTotalPrice() + totalShipping)}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray1 font-bold mb-2">Phương thức thanh toán</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Thanh toán khi nhận hàng (Tiền mặt)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    checked={paymentMethod === 'MOMO'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Thanh toán qua MoMo</span>
                  <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png" alt="MoMo" className="w-8 h-8" />
                </label>
                 <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Thanh toán qua VNPay</span>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGqg3OFoapBc2qLOu-Fl6_Ep4vFlzqTdK5rA&s" alt="VNPay" className="w-8 h-8" />
                </label>
                {/* <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Thanh toán qua VNpay</span>
                  <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" className="w-8 h-8" />
                </label> */}
              </div>
            </div>

            <div className="mt-5 flex">
              <button disabled={isLoading} onClick={handleDatHang} className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark">{isLoading ? <ButtonLoading /> : "Đặt hàng"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
