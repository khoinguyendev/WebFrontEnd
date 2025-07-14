import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import ButtonLoading from "../../../components/admin/ButtonLoading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SnipperLoading from "../../../components/admin/SnipperLoading";
import toast from "react-hot-toast";

// ✅ Cập nhật schema validation, description có thể có hoặc không
const brandSchema = z.object({
  name: z
    .string()
    .min(3, "Tên thương hiệu phải có ít nhất 3 ký tự")
    .max(50, "Tên thương hiệu không quá 50 ký tự")
    .trim(), 
    description: z
    .string()
    .optional()
    .refine(val => val === undefined || val.length <= 255, {
      message: "Mô tả không quá 255 ký tự",
    }), // Kiểm tra độ dài mô tả chỉ khi có giá trị
});

type BrandFormValues = z.infer<typeof brandSchema>;

const EditBrand = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "", // Thêm trường description vào default values
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_HOST}/Brand/${id}`);
        const brandData = response.data;
        reset({
          name: brandData.name || "",
          description: brandData.description || "", // Cập nhật giá trị mô tả
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const response = await axios.put(`${SERVER_HOST}/Brand/${id}`, data);
      toast.success("Sửa thương hiệu thành công");
      console.log("Phản hồi từ server:", response.data);
    } catch (error: any) {
      if (error.response?.data?.data?.code === 404) {
        toast.error("Tên thương hiệu đã tồn tại");
      } else {
        toast.error("Lỗi khi cập nhật thương hiệu. Vui lòng thử lại sau.");
      }
    }
  };

  // Nếu đang tải dữ liệu
  if (isLoading) return <SnipperLoading />;

  return (
    <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sửa thương hiệu</h3>

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

          {/* Mô tả */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
            <textarea
              {...register("description")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mô tả thương hiệu"
            />
            {errors.description && (
              <p className="text-red text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Nút submit */}
          <div className="flex gap-4 my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? <ButtonLoading /> : "Lưu"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
