import axios from "axios";
import React, { useEffect, useState } from "react";
import { IProvince } from "../../types/Province";
import { IDistrict } from "../../types/District";
import { IWard } from "../../types/Ward";
import { SERVER_HOST } from "../../configs/UrlServer";

const AddressStore = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState<number | string>("");
    const [selectedDistrist, setSelectedDist] = useState<number | string>("");
    const [selectedWard, setSelectedWard] = useState<number | string>("");
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [distrists, setDistrists] = useState<IDistrict[]>([]);
    const [wards, setWards] = useState<IWard[]>([]);
    const [address, setAddress] = useState<any|null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const responseCategory = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
                    headers: {
                        // Custom token header without "Bearer"
                        token: import.meta.env.VITE_TOKEN_GHN, // Instead of 'Bearer token', it's just the token itself
                    },
                });
                setProvinces(responseCategory.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/address-store/1`);
                setAddress(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    const handleSelectProvince = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(event.target.value);
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

    const handleSelectDistrict = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDist(event.target.value);
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

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSelectWard = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWard(event.target.value);

    };
    const handleCreate = async () => {
        if (!selectedProvince || !selectedDistrist || !selectedWard) {
            alert("Vui lòng chọn đầy đủ thông tin địa chỉ");
            return;
        }
        const data = {
            provinceId: Number(selectedProvince),
            provinceName: provinces.find((p) => p.ProvinceID == selectedProvince)?.ProvinceName || "",
            districtName: distrists.find((d) => d.DistrictID == selectedDistrist)?.DistrictName || "",
            wardName: wards.find((w) => w.WardCode === selectedWard)?.WardName || "",
            districtId: Number(selectedDistrist),
            wardId: Number(selectedWard),
        };
        try {
          await axios.put(`${SERVER_HOST}/address-store/1`, data);
          setAddress(data);
          alert("Lưu địa chỉ thành công");
        } catch (error) {
          console.error("Error saving address:", error);
          alert("Lỗi khi lưu địa chỉ");
        }
    };
   
    return (
        <div className=" mx-auto">
            <div className="mb-2">{address?.wardName + ", " + address?.districtName + ", " + address?.provinceName}</div>
            <div className="mb-2">
                <select value={selectedProvince} onChange={handleSelectProvince} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
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
                <select value={selectedDistrist} onChange={handleSelectDistrict} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
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
                <select value={selectedWard} onChange={handleSelectWard} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Chọn Phường/Xã</option>
                    {wards.length > 0 &&
                        wards.map((d) => (
                            <option key={d.WardCode} value={d.WardCode}>
                                {d.WardName}
                            </option>
                        ))}
                </select>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleCreate}>Lưu</button>
        </div>
    );
};

export default AddressStore;
