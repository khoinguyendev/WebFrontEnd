import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IUserAddress } from "../../../types/UserAddress";
import ModalAdd from "./ModalAdd";

const Address = () => {
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Thay đổi userId thành id thực tế bạn muốn lấy
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchAddresses();
  }, []);
  const handleAddClick = () => {
    setShowModal(true);
  };
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user-address/user/${user?.id}`
      );
      setAddresses(response.data);
      console.log("Địa chỉ:", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSetDefault = async (addressId: number) => {
    try {
      await axios.put(
        `http://localhost:8080/api/user-address/default/${addressId}`
      );
      fetchAddresses(); // Refresh lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ mặc định:", error);
    }
  };
  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <button
        onClick={handleAddClick}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Thêm
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Họ tên</th>
            <th className="border p-2">Số điện thoại</th>
            <th className="border p-2">Tỉnh/TP</th>
            <th className="border p-2">Quận/Huyện</th>
            <th className="border p-2">Phường/Xã</th>
            <th className="border p-2">Địa chỉ chi tiết</th>
            <th className="border p-2">Mặc định</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.id}>
              <td className="border p-2">{address.name}</td>
              <td className="border p-2">{address.phone}</td>
              <td className="border p-2">{address.provinceName}</td>
              <td className="border p-2">{address.districtName}</td>
              <td className="border p-2">{address.wardName}</td>
              <td className="border p-2">{address.street}</td>
              <td className="border p-2 text-center">
                  {address.defaultAddress ? (
                    "✅"
                  ) : (
                    <button
                      className="px-2 py-1 text-sm bg-green-600 text-white rounded"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Đặt làm mặc định
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <ModalAdd
          userId={user?.id || 0} // truyền userId từ Redux store
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAddresses()} // gọi lại API để cập nhật danh sách
        />
      )}
    </div>
  );
};

export default Address;
