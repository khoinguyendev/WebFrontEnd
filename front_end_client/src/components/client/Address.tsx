import axios from "axios";
import React, { useEffect, useState } from "react";
import { IProvince } from "../../types/Province";
import { IDistrict } from "../../types/District";
import { IWard } from "../../types/Ward";
import MapPicker from "./map/MapPicker";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IUserAddress } from "../../types/UserAddress";
import { set } from "lodash";

const Address = ({
  setTotalShipping,
  setAddress,
  address,
  setShipInfo,
}: {
  setTotalShipping: any;
  setAddress: any;
  address: string;
  setShipInfo: any;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<number | string>("");
  const [selectedDistrist, setSelectedDist] = useState<number | string>("");
  const [selectedWard, setSelectedWard] = useState<number | string>("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [distrists, setDistrists] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [openMap, setOpenMap] = useState(false);
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!user?.id) return;
        const res = await axios.get(
          `http://localhost:8080/api/user-address/user/${user.id}`
        );
        const defaultAddr = res.data.find(
          (addr: IUserAddress) => addr.defaultAddress
        );
        if (defaultAddr) {
          setSelectedProvince(defaultAddr.provinceId);
          setSelectedDist(defaultAddr.districtId);
          setSelectedWard(String(defaultAddr.wardId));
          setPhone(defaultAddr.phone);
          setName(defaultAddr.name);
          setAddress(defaultAddr.street);
          setShipInfo((prev: any) => ({
            ...prev,
            provinceId: defaultAddr.provinceId,
            provinceName: defaultAddr.provinceName,
            districtId: defaultAddr.districtId,
            districtName: defaultAddr.districtName,
            wardId: defaultAddr.wardId,
            wardName: defaultAddr.wardName,
            phone: defaultAddr.phone,
            name: defaultAddr.name,
            address: defaultAddr.street,
          }));
          await fetchDistricts(defaultAddr.provinceId);
          await fetchWards(defaultAddr.districtId);

          // 🔥 Gọi tính phí ở đây:
          await calculateShippingFee(
            defaultAddr.districtId,
            String(defaultAddr.wardId)
          );
        }
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ mặc định:", err);
      }
    };

    fetchAddresses();
  }, []);
  const calculateShippingFee = async (
    toDistrictId: number,
    toWardCode: string
  ) => {
    const data = {
      service_type_id: 2,
      insurance_value: 200000,
      coupon: null,
      from_district_id: Number(import.meta.env.VITE_FROM_DISTRICT_ID),
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      height: 15,
      length: 15,
      weight: 1000,
      width: 15,
    };

    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        data,
        {
          headers: {
            token: import.meta.env.VITE_TOKEN_GHN,
          },
        }
      );
      setTotalShipping(response.data.data.total);
    } catch (error) {
      console.log("Lỗi khi tính phí vận chuyển:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseCategory = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              // Custom token header without "Bearer"
              token: import.meta.env.VITE_TOKEN_GHN, // Instead of 'Bearer token', it's just the token itself
            },
          }
        );
        setProvinces(responseCategory.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectProvince = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProvince(event.target.value);
    setShipInfo((prev: any) => ({
      ...prev,
      provinceName: event.target.options[event.target.selectedIndex].text,
      provinceId: event.target.value,
    }));
    setIsLoading(true);
    try {
      const responseCategory = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          province_id: Number(event.target.value), // Request body
        },
        {
          headers: {
            token: import.meta.env.VITE_TOKEN_GHN, // Custom token header without "Bearer"
          },
        }
      );
      setDistrists(responseCategory.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDistrict = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDist(event.target.value);
    setShipInfo((prev: any) => ({
      ...prev,
      districtName: event.target.options[event.target.selectedIndex].text,
      districtId: event.target.value,
    }));
    setIsLoading(true);
    try {
      const responseCategory = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          district_id: Number(event.target.value), // Request body
        },
        {
          headers: {
            token: import.meta.env.VITE_TOKEN_GHN, // Custom token header without "Bearer"
          },
        }
      );
      setWards(responseCategory.data.data);
      setShipInfo((prev: any) => ({
        ...prev,
        wardName: responseCategory.data.data[0].WardName,
        wardId: responseCategory.data.data[0].WardCode,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDistricts = async (provinceId: number) => {
    try {
      const res = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: provinceId },
        { headers: { token: import.meta.env.VITE_TOKEN_GHN } }
      );
      setDistrists(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy quận:", err);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const res = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        { district_id: districtId },
        { headers: { token: import.meta.env.VITE_TOKEN_GHN } }
      );
      setWards(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy phường:", err);
    }
  };

  const handleSelectWard = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const wardName = e.target.options[e.target.selectedIndex].text;
    setSelectedWard(wardCode);
    setShipInfo((prev: any) => ({ ...prev, wardId: wardCode, wardName }));

    const data = {
      service_type_id: 2,
      insurance_value: 200000,
      coupon: null,
      from_district_id: Number(import.meta.env.VITE_FROM_DISTRICT_ID),
      to_district_id: Number(selectedDistrist),
      to_ward_code: wardCode,
      height: 15,
      length: 15,
      weight: 1000,
      width: 15,
    };

    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        data,
        {
          headers: {
            token: import.meta.env.VITE_TOKEN_GHN,
          },
        }
      );
      setTotalShipping(response.data.data.total);
    } catch (error) {
      console.log("Lỗi tính phí:", error);
    }
  };
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        alert(
          "Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật lại trong cài đặt trình duyệt."
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Vị trí hiện tại:",
            position.coords.latitude,
            position.coords.longitude
          );
          setOpenMap(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Bạn đã từ chối quyền truy cập vị trí.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("Không thể lấy thông tin vị trí.");
          } else if (error.code === error.TIMEOUT) {
            alert("Yêu cầu vị trí quá thời gian.");
          } else {
            alert("Lỗi không xác định khi lấy vị trí.");
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền vị trí:", error);
    }
  };
 const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === "phone") {
    const vietnamPhoneRegex =
      /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    setPhone(value);
    if (!vietnamPhoneRegex.test(value)) {
      setErrorPhone("Số điện thoại không hợp lệ.");
    } else {
      setErrorPhone("");
    }
  }

  if (name === "name") {
    setName(value);
  }
  
  if (name === "email") {
    setEmail(value);
  }

  if (name === "note") {
    setNote(value);
  }

  setShipInfo((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};

  return (
    <div className=" mx-auto">
      <div className="mb-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-400">
          Tên
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChangeInput}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
     
       <div className="mb-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-400">
          Số điện thoại
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={handleChangeInput}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errorPhone && <p className="text-red text-sm mt-1">{errorPhone}</p>}
      </div>
      <div className="mb-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-400">
          Email (Không bắt buộc)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChangeInput}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-2">
        <select
          value={selectedProvince}
          onChange={handleSelectProvince}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Chọn Tỉnh/TP</option>
          {provinces.length > 0 &&
            provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-2">
        <select
          value={selectedDistrist}
          onChange={handleSelectDistrict}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Chọn Quận/Huyện</option>
          {distrists.length > 0 &&
            distrists.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-2">
        <select
          value={selectedWard}
          onChange={handleSelectWard}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.length > 0 &&
            wards.map((d) => (
              <option key={d.WardCode} value={d.WardCode}>
                {d.WardName}
              </option>
            ))}
        </select>
      </div>
      <div>
        <div className="flex items-center">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-400 "
          >
            Địa chỉ
          </label>
          <button onClick={handleGetLocation} className="ms-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </button>
        </div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-500"
          rows={2}
        />
      </div>
     <div>
       <label
            htmlFor="note"
            className="text-sm font-medium text-gray-400 "
          >
            Ghi chú (Không bắt buộc)
          </label>
       <textarea
          value={note}
          name="note"
          onChange={handleChangeInput}
          className="w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-500"
          rows={2}
        />
     </div>
      <MapPicker
        isOpen={openMap}
        setOpen={setOpenMap}
        setAddress={setAddress}
      />
    </div>
  );
};

export default Address;
