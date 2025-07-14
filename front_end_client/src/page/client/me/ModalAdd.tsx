import axios from "axios";
import { useEffect, useState } from "react";
import { IProvince } from "../../../types/Province";
import { IDistrict } from "../../../types/District";
import { IWard } from "../../../types/Ward";
import toast from "react-hot-toast";

interface Props {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalAdd = ({ userId, onClose, onSuccess }: Props) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    defaultAddress: false,
  });

  // Fetch province on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              token: import.meta.env.VITE_TOKEN_GHN,
            },
          }
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleSelectProvince = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: Number(provinceId) },
        { headers: { token: import.meta.env.VITE_TOKEN_GHN } }
      );
      setDistricts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDistrict = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    setWards([]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        { district_id: Number(districtId) },
        { headers: { token: import.meta.env.VITE_TOKEN_GHN } }
      );
      setWards(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvince || !selectedDistrict || !selectedWard) return;

    const province = provinces.find(p => p.ProvinceID == Number(selectedProvince));
    const district = districts.find(d => d.DistrictID == Number(selectedDistrict));
    const ward = wards.find(w => w.WardCode === selectedWard);

    const payload = {
      name: form.name,
      phone: form.phone,
      street: form.street,
      defaultAddress: false,
      provinceId: province?.ProvinceID,
      provinceName: province?.ProvinceName,
      districtId: district?.DistrictID,
      districtName: district?.DistrictName,
      wardId: parseInt(ward?.WardCode || "0"),
      wardName: ward?.WardName,
    };

    try {
        await axios.post("http://localhost:8080/api/user-address", payload);
        toast.success("Thêm địa chỉ thành công");
      onSuccess(); // gọi callback để reload danh sách
       onClose();   // đóng modal
    } catch (error) {
      console.error("Lỗi tạo địa chỉ:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        <h3 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Họ tên"
            className="border p-2 mb-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="border p-2 mb-2 w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <select
            value={selectedProvince}
            onChange={handleSelectProvince}
            className="w-full px-4 py-2 border mb-2"
            required
          >
            <option value="">Chọn Tỉnh/TP</option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={handleSelectDistrict}
            className="w-full px-4 py-2 border mb-2"
            required
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
          </select>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-4 py-2 border mb-2"
            required
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Địa chỉ chi tiết"
            className="border p-2 mb-2 w-full"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            required
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdd;
