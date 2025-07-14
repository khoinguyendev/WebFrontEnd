import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MultiImageUploader from "../../../components/admin/MultiImageUploader";
import { formatCurrency } from "../../../util/Format";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import { useEffect, useState } from "react";
import { ICategory } from "../../../types/Category";
import { IBrand } from "../../../types/Brand";
import toast from "react-hot-toast";
import FroalaEditors from "./FroalaEditor";

// ✅ Định nghĩa schema validation bằng Zod
const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
      .transform((val) => val.replace(/\s+/g, " ")),
    description: z.string().optional(), // Không bắt buộc nhập
    detail: z.string().optional(), // Không bắt buộc nhập
    price: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1.000").max(100000000, "Giá phải lớn hơn 100.000.000"),
    priceDiscount: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1000").max(100000000, "Giá phải lớn hơn 100.000.000").optional(),
    image: z.array(z.any()).min(1, "Vui lòng chọn ít nhất 1 ảnh").max(4, "Tối đa 4 ảnh"),
    categoryId: z.number().positive("Vui lòng chọn 1 danh mục"),
    brandId: z.number().positive("Vui lòng chọn 1 thương hiệu"),
    isDiscount: z.string(),
    status: z.string(),
    stock: z.number().min(0, "Số lượng >=0"),
  })
  .refine(
    (data) => {
      if (data.isDiscount === "true" && data.priceDiscount !== undefined) {
        return data.priceDiscount < data.price;
      }
      return true;
    },
    { message: "Giá sau khi giảm phải nhỏ hơn giá gốc", path: ["priceDiscount"] }
  );

type ProductFormValues = z.infer<typeof productSchema>;

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      status: "INACTIVE",
      categoryId: 0,
      brandId: 0,
      isDiscount: "false",
      image: [],
      stock: 0,
    },
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false); // ✅ Thêm state resetTrigger
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseCategory = await axios.get(`${SERVER_HOST}/categories`);
        const categoryData = responseCategory.data.data.content;
        const responseBrand = await axios.get(`${SERVER_HOST}/brands`);
        const brandData = responseBrand.data.data;
        setCategories(categoryData);
        setBrands(brandData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const onSubmit = async (data: ProductFormValues) => {
    // Chuyển dữ liệu thành FormData
    const formData = new FormData();
    const product = {
      name: data.name,
      price: data.price,
      discount: data.isDiscount == "true" ? true : false,
      categoryId: data.categoryId,
      brandId: data.brandId,
      status: data.status,
      priceDiscount: data.priceDiscount,
      detail: detail,
      description: data.description,
      stock: data.stock,
    };
    console.log("Dữ liệu sản phẩm:", product);
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    // Đính kèm tất cả ảnh vào FormData
    data.image.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await axios.post(`${SERVER_HOST}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Phản hồi từ server:", response.data);
      reset();
      setResetTrigger((pre) => !pre);
      toast.success("Thêm thành công");
    } catch (error: any) {
      console.error("Lỗi khi gửi sản phẩm:", error);
      if (error.response.data.statusCode === 409) toast.error("Tên đã tồn tại");
      else toast.error("Internal server error");
    }
  };

  const price = watch("price");
  const priceDiscount = watch("priceDiscount");
  const isDiscount = watch("isDiscount");
  // Khi reset, đặt lại giá trị mặc định cho radio
  useEffect(() => {
    if (isDiscount === "false") {
      setValue("priceDiscount", undefined); // Reset priceSale khi chọn "Không"
    }
  }, [isDiscount, setValue]);
  return (
    <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thêm sản phẩm</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
        <div>
          {/* Tên sản phẩm */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
            <input {...register("name")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Nhập tên sản phẩm" />
            {errors.name && <p className="text-red text-sm mt-1">{errors.name.message}</p>}
          </div>
          {/* Giá sản phẩm */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập giá"
            />
            {errors.price && <p className="text-red text-sm mt-1">{errors.price.message}</p>}
            {price > 0 && <p className="text-green-600 text-sm mt-1">{formatCurrency(price)}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Danh mục
            </label>
            <select
              defaultValue={0}
              id="category-create"
              {...register("categoryId", { valueAsNumber: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value={0}>Chọn danh mục</option>
              {!isLoading &&
                categories?.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
            </select>
            {errors.categoryId && <p className="text-red text-sm mt-1">{errors.categoryId.message}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Thương hiệu
            </label>
            <select
              defaultValue={0}
              id="category-create"
              {...register("brandId", { valueAsNumber: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value={0}>Chọn thương hiệu</option>
              {!isLoading &&
                brands?.map((brand) => {
                  return (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  );
                })}
            </select>
            {errors.brandId && <p className="text-red text-sm mt-1">{errors.brandId.message}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Giảm giá
            </label>
            <div>
              <div className="flex items-center mb-4">
                <input
                  {...register("isDiscount")}
                  id="discount-no"
                  type="radio"
                  defaultChecked
                  value="false"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="discount-no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Không
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("isDiscount")}
                  id="discount-yes"
                  type="radio"
                  value="true"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="discount-yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Có
                </label>
              </div>
            </div>
            {errors.isDiscount && <p className="text-red text-sm mt-1">{errors.isDiscount.message}</p>}
          </div>
          {isDiscount == "true" && (
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá sau khi giảm</label>
              <input
                type="number"
                {...register("priceDiscount", { valueAsNumber: true })}
                className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập giá"
              />
              {errors.priceDiscount && <p className="text-red text-sm mt-1">{errors.priceDiscount.message}</p>}
              {priceDiscount && <p className="text-green-600 text-sm mt-1">{formatCurrency(priceDiscount)}</p>}
            </div>
          )}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tồn kho</label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập giá"
            />
            {errors.stock && <p className="text-red text-sm mt-1">{errors.stock.message}</p>}
          </div>
          {/* Nút submit */}
          <div className="flex gap-4 my-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Thêm sản phẩm
            </button>
            <button
              onClick={() => {
                reset();
                setResetTrigger((prev) => !prev);
              }}
              type="reset"
              className="bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh sản phẩm</label>
          <MultiImageUploader setValue={setValue} resetTrigger={resetTrigger} />
          {errors.image && <p className="text-red text-sm mt-1">{errors.image.message}</p>}
          <div className="mb-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Xuất bản
            </label>
            <select
              defaultValue="INACTIVE"
              {...register("status")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="INACTIVE">Không xuất bản</option>
              <option value="ACTIVE">Xuất bản</option>
            </select>
            {errors.categoryId && <p className="text-red text-sm mt-1">{errors.categoryId.message}</p>}
          </div>
        </div>
        <div className="col-span-2">
          <FroalaEditors setDetail={setDetail} />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
