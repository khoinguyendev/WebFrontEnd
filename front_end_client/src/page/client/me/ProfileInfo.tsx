import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../../components/admin/ButtonLoading";
import { useCallback } from "react";
import { clearCart } from "../../../redux/cartSlice";
import { logout } from "../../../redux/authSlice";

// ✅ Schema validation
const userSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    name: z.string().optional(),
    phone: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val || /^(0[3|5|7|8|9])+([0-9]{8})\b/.test(val),
            {
                message: "Số điện thoại không hợp lệ",
            }
        ),
    address: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const ProfileInfo = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: user?.email,
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
        },
    });
    const dispatch=useDispatch();
    const onSubmit = async (data: UserFormValues) => {
        const user = {
            name: data.name,
            address: data.address,
            phone: data.phone
        }
        try {
            await axios.put(`${SERVER_HOST}/users`, user);
            toast.success("Cập nhật thành công");
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    };
    
const handleLogout = useCallback(async () => {
    try {
      await axios.get(`http://localhost:8080/auth/logout-success`);
      // Xóa token và các thông tin liên quan
      localStorage.removeItem("token");
      sessionStorage.clear();
      dispatch(clearCart());
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [dispatch]);
    return (
        <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
                {/* Email */}
                <div className="mb-2 col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        disabled
                        {...register("email")}
                        className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.email && <p className="text-red text-sm mt-1">{errors.email.message}</p>}
                </div>



                {/* Name */}
                <div className="mb-2 col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
                    <input
                        {...register("name")}
                        className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Address */}
                {/* <div className="mb-2 col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ</label>
                    <input
                        {...register("address")}
                        className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                    />
                </div> */}
                {/* <div className="mb-2 col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">SDT</label>
                    <input
                        {...register("phone")}
                        className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.phone && <p className="text-red text-sm mt-1">{errors.phone.message}</p>}

                </div> */}


                {/* Nút submit */}
                <div className="col-span-2 flex gap-4 mt-2">
                    {/* <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white py-2 px-4 rounded-lg"
                    >
                        {isSubmitting ? <ButtonLoading /> : "Cập nhật thông tin"}
                    </button> */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isSubmitting}
                        className="bg-primary text-white py-2 px-4 rounded-lg"
                    >
                         Đăng xuất
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;
