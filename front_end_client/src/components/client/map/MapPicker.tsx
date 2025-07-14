import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";

const MapClickHandler: React.FC<{ setPosition: (pos: L.LatLng) => void; fetchAddress: (lat: number, lng: number) => void; }> = ({ setPosition, fetchAddress}) => {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    const newPosition = L.latLng(lat, lng);
    setPosition(newPosition);
    fetchAddress(lat, lng);
  });

  return null; // Không cần render gì cả
};

const MapPicker: React.FC<{ setOpen: (open: boolean) => void; isOpen: boolean; setAddress: (address: string) => void }> = ({ setOpen, isOpen, setAddress }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [address1, setAddress1] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
   
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userPosition = L.latLng(latitude, longitude);
          setPosition(userPosition);
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setPosition(L.latLng(14.0583, 108.2772)); // Mặc định Việt Nam
        }
      );
      setIsLoading(false);
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition(L.latLng(14.0583, 108.2772));
    }
  }, [isOpen]);

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      // if (data.display_name) {
      //   setAddress(data.display_name);
      // }
      // const fields = [data.address.house_number, data.address.road, data.address.suburb, data.address.city];
      const fields = [data.address.house_number, data.address.road];

      const fullAddress = fields.filter((value) => value !== null && value !== undefined && value !== "").join(", ");

      setAddress1(fullAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChooseAddress = () => {
    console.log("Địa chỉ đã chọn:", address1);
    setAddress(address1);
    setOpen(false);
    // dispatch(setAdress(address));
    // dispatch(closeMap());
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg relative p-3">
        <button onClick={() => setOpen(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        {position && (
          <MapContainer center={position} zoom={20} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <Marker position={position}>
              <Popup>Vị trí đã chọn</Popup>
            </Marker>
            {!isLoading && <MapClickHandler setPosition={setPosition} fetchAddress={fetchAddressFromCoordinates} />}
          </MapContainer>
        )}
        {address1 && (
          <div>
            <h3>Địa chỉ đã chọn:</h3>
            <p>{address1}</p>
            <button onClick={handleChooseAddress} className="mt-2 bg-primary text-gray1  py-2 px-2 rounded text-base">
              Xác nhận
            </button>
          </div>
        )}
        {/* {position && (
          <div>
            <h3>Tọa độ:</h3>
            <p>
              Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MapPicker;
