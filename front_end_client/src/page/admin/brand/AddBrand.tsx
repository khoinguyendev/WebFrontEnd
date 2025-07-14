import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../../components/admin/ButtonLoading";
import toast from "react-hot-toast";

// ✅ Sửa lại schema validation (chỉ một ảnh)
const brandSchema = z.object({
  name: z
    .string()
    .min(3, "Tên danh mục phải có ít nhất 3 ký tự")
    .max(50, "Tên danh mục phải không quá 50 ký tự"),
  description: z.string().optional(), // Trường description có thể có hoặc không
});

type BrandFormValues = z.infer<typeof brandSchema>;

const AddBrand = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "", // Default value for description
    },
  });

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const response = await axios.post(`${SERVER_HOST}/Brand`, data);

      console.log("Phản hồi từ server:", response.data);
      toast.success("Thêm thành công");
      reset(); // Reset form after successful submission
    } catch (error: any) {
      if (error.response?.data?.data?.code === 404) toast.error("Tên đã tồn tại");
      else toast.error("Internal server error");
    }
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thêm thương hiệu</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
        <div>
          {/* Tên thương hiệu */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
            <input
              {...register("name")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên thương hiệu"
            />
            {errors.name && <p className="text-red text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Mô tả thương hiệu */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả (Tùy chọn)</label>
            <textarea
              {...register("description")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mô tả thương hiệu (tùy chọn)"
            />
            {errors.description && <p className="text-red text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Nút submit */}
          <div className="flex gap-4 my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? <ButtonLoading /> : "Thêm thương hiệu"}
            </button>
            <button
              onClick={() => {
                reset();
              }}
              type="reset"
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

export default AddBrand;
