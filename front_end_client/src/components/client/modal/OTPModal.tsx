import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../admin/ButtonLoading";

const OTPModal = ({ setIsLogin, userId }: { setIsLogin: any; userId: number | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Chỉ cho phép nhập số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const hanldeSubmit = async () => {
    if (userId == null) return;
    const code = otp.join("");
    try {
      setIsLoading(true);
      await axios.get(`${SERVER_HOST}/users/active/${userId}?code=${code}`);
      toast.success("Kích hoạt thành công");
      setIsLogin(true);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[400px] rounded-lg shadow-lg relative p-6">
        {/* Nút đóng modal */}
        {/* <button className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button> */}

        <h2 className="text-gray1 font-medium text-2xl text-center">Nhập mã OTP</h2>
        <p className="text-gray-500 text-center mt-2">Vui lòng nhập mã gồm 6 số</p>

        {/* Ô nhập OTP */}
        <div className="flex justify-center gap-3 mt-4">
          {otp.map((num, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={num}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg outline-none focus:border-primary"
            />
          ))}
        </div>

        {/* Nút xác nhận */}
        <button disabled={isLoading} className="w-full mt-6 bg-primary text-gray1 font-medium py-3 rounded text-base" onClick={hanldeSubmit}>
          {isLoading ? <ButtonLoading /> : "Xác nhận"}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
