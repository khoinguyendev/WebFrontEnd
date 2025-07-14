import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ButtonLoading from "../../../utils/ButtonLoading";
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const UserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
  role: z.enum(["STAFF", "MANAGER"], {
    errorMap: () => ({ message: "Vui lòng chọn vai trò" }),
  }),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"], // gắn lỗi vào confirmPassword
      code: z.ZodIssueCode.custom,
      message: "Mật khẩu xác nhận không khớp",
    });
  }
});
type UserType = z.infer<typeof UserSchema>;

const AddUser = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "STAFF",
      name: "",
    },
  });

  const onSubmit = async (data: UserType) => {
    try {
      const dataRaw = {
        email: data.email,
        password: data.password,
        role: data.role,
        name: data.name,
      };
      // Gọi API để thêm người dùng
      await axios.post(`${SERVER_HOST}/users/create-by-admin`, dataRaw);
      toast.success("Thêm thành công");
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
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
            <input
              type="text"
              {...register("name")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          {/* Email */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              type="email"
              {...register("email")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
            <input
              type="password"
              {...register("password")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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

          {/* Role */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vai trò</label>
            <select
              {...register("role")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            >
              <option value="STAFF">Nhân viên</option>
              {user?.role === "ADMIN" && <option value="MANAGER">Quản lý</option>}
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Nút Submit & Reset */}
          <div className="flex gap-4 my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? <ButtonLoading /> : "Thêm"}
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
  );
};

export default AddUser;

