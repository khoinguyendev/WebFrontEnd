import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import ButtonLoading from "../../admin/ButtonLoading";
import OTPModal from "./OTPModal";
import { SERVER_HOST } from "../../../config/Url";
const userSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^(0[1-9][0-9]{8}|84[1-9][0-9]{8})$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(15, "Mật khẩu không được quá 15 ký tự"),
});
type RegisterFormValues = z.infer<typeof userSchema>;
const RegisterModal = ({ setOpenModal, setIsLogin }: { setOpenModal: any; setIsLogin: any }) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModelOTP, setIsModelOTP] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Dữ liệu sản phẩm:", data);

    try {
      setIsLoading(true);
      const user = await axios.post(`${SERVER_HOST}/users`, data);
      toast.success("Đăng kí thành công");
      setUserId(user.data.data.id);
      setIsModelOTP(true);
    } catch (error: any) {
      console.log(error);
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isModelOTP ? (
        <OTPModal setIsLogin={setIsLogin} userId={userId} />
      ) : (
        <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[600px] rounded-lg  shadow-lg relative">
            <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="py-6 px-6">
              <h2 className="text-gray1 font-medium text-2xl">Đăng kí</h2>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input {...register("email")} type="text" className="w-full mt-2 border outline-none border-gray-300 rounded-lg p-3 text-gray-500" />
                {errors.email && <p className="text-red text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400">Số điện thoại</label>
                <input {...register("phone")} type="text" className="w-full mt-2 border outline-none border-gray-300 rounded-lg p-3 text-gray-500" />
                {errors.phone && <p className="text-red text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400">Mật khẩu</label>
                <input {...register("password")} type="password" className="w-full outline-none mt-2 border border-gray-300 rounded-lg p-3 text-gray-500" />
                {errors.password && <p className="text-red text-sm mt-1">{errors.password.message}</p>}
              </div>
            </div>
            <div className="px-6 text-sm">
              Bạn đã có tài khoản?
              <span className="text-blue-700 cursor-pointer ms-2" onClick={() => setIsLogin((pre: boolean) => !pre)}>
                Đăng nhập
              </span>
            </div>
            <div className="px-6 py-6">
              <button type="submit" disabled={isLoading} className=" w-full bg-primary text-white font-medium py-3 px-4 rounded text-base">
                {isLoading ? <ButtonLoading /> : "Đăng kí"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default RegisterModal;
