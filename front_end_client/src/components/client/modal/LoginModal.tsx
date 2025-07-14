import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

import axios from "axios";
import toast from "react-hot-toast";
import { loginSuccess } from "../../../redux/authSlice";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../admin/ButtonLoading";
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(15, "Mật khẩu không được quá 15 ký tự"),
});

type LoginFormValues = z.infer<typeof userSchema>;
const LoginModal = ({ setOpenModal, setIsLogin }: { setOpenModal: any; setIsLogin: any }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true); // Bật loading
      // Gửi API đăng nhập
      const response = await axios.post(`${SERVER_HOST}/auth/log-in`, data);
      dispatch(loginSuccess({ token: response.data.token, user: response.data.user }));
      toast.success("Đăng nhập thành công");
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      localStorage.setItem("token", response.data.token);
      setOpenModal(false);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Tài khoản hoặc mật khẩu không chính xác");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };
  const handleLogin = () => {
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
  };
  return (
    <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[600px] rounded-lg  shadow-lg relative">
        <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="py-6 px-6">
          <h2 className="text-gray1 font-medium text-2xl">Đăng nhập</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input {...register("email")} type="text" className="w-full mt-2 border outline-none border-gray-300 rounded-lg p-3 text-gray-500" />
            {errors.email && <p className="text-red text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">Mật khẩu</label>

            <input {...register("password")} type="password" className="w-full outline-none mt-2 border border-gray-300 rounded-lg p-3 text-gray-500" />
            {errors.password && <p className="text-red text-sm mt-1">{errors.password.message}</p>}
          </div>
        </div>
        <div className="px-6 mb-2">
          {/* <div className="flex items-center gap-3">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-500" />
            <label className="block text-sm font-medium text-gray-400">Ghi nhớ mật khẩu</label>
          </div> */}
          {/* <div className="flex items-center gap-3">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-500" />
            <label className="block text-sm font-medium text-gray-400">Quên mật khẩu?</label>
          </div> */}
        </div>
        <div className="px-6 text-sm">
          Bạn chưa có tài khoản?
          <span className="text-blue-700 cursor-pointer" onClick={() => setIsLogin(false)}>
            Đăng kí ngay
          </span>
        </div>
        <div className="px-6 py-6">
          <button type="submit" disabled={isLoading} className=" w-full bg-primary text-white font-medium py-3 px-4 rounded text-base">
            {isLoading ? <ButtonLoading /> : "Đăng nhập"}
          </button>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="mt-3 gap-2 border border-1 border-primary items-center flex justify-center w-full text-gray1 font-medium py-2 px-4 rounded text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={30} height={30} viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>

            {"Đăng nhập bằng google"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default LoginModal;
