import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SERVER_HOST } from "../../configs/UrlServer";
import axios from "axios";
import toast from "react-hot-toast";
import ButtonLoading from "../../utils/ButtonLoading";

const UserSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
  
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"], // gắn lỗi vào confirmPassword
      code: z.ZodIssueCode.custom,
      message: "Mật khẩu xác nhận không khớp",
    });
  }
});
type UserType = z.infer<typeof UserSchema>;
const ChangePassword = () => {
     const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<UserType>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
          password: "",
          newPassword: "",
          confirmPassword: "",
        },
      });
      const onSubmit = async (data: UserType) => {
    try {
      const dataRaw = {
        currentPassword: data.password,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      // Gọi API để thêm người dùng
      await axios.put(`${SERVER_HOST}/users/change-password`, dataRaw);
      toast.success("Thay đổi mật khẩu thành công");
      reset(); // Reset form sau khi thêm thành công
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi thêm người dùng");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
        <div>
         <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu hiện tại</label>
            <input
              type="password"
              {...register("password")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* New Password */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu mới</label>
            <input
              type="password"
              {...register("newPassword")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu mới"
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Xác nhận mật khẩu"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

         

          {/* Nút Submit & Reset */}
          <div className="flex gap-4 my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? <ButtonLoading /> : "Lưu thay đổi"}
            </button>
            <button
              onClick={() => reset()}
              type="button"
              className="bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword