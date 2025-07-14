import { useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "../../../util/Format";
import ButtonLoading from "../../../components/admin/ButtonLoading";
import { IVariant } from "../../../types/Variant";

interface ModelAddVariantProps {
  setOpenModal: (o: boolean) => void;
  productId?: string | undefined;
  variants: IVariant[];
  setLoad: (l: any) => void;
}

const variantSchema = z
  .object({
    price: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1.000").max(100000000, "Giá phải lớn hơn 100.000.000"),
    priceDiscount: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1000").max(100000000, "Giá phải lớn hơn 100.000.000").optional(),
    sale: z.string(),
    color: z.string(),
    size: z.string(),
    storage: z.string(),
    stock: z.number().min(0, "Số lượng phải >=0"),
  })
  .refine(
    (data) => {
      if (data.sale === "true" && data.priceDiscount !== undefined) {
        return data.priceDiscount < data.price;
      }
      return true;
    },
    { message: "Giá sau khi giảm phải nhỏ hơn giá gốc", path: ["priceDiscount"] }
  );
type VatiantFormValues = z.infer<typeof variantSchema>;

const ModelAddVariant = ({ setOpenModal, productId, variants, setLoad }: ModelAddVariantProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VatiantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      size: "",
      color: "",
      storage: "",
      stock: 0,
      sale: "false",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const price = watch("price");
  const sale = watch("sale");
  const priceDiscount = watch("priceDiscount");
  const onSubmit = async (data: VatiantFormValues) => {
    if (!data.size && !data.color && !data.storage) {
      toast.error("Ít nhất có 1 thuộc tính");
    }
    const variant = {
      productId: Number(productId),
      price: data.price,
      sale: data.sale == "true" ? true : false,
      size: data.size ? data.size : null,
      color: data.color ? data.color : null,
      storage: data.storage ? data.storage : null,
      stock: data.stock,
      priceSale: data.priceDiscount !== undefined ? data.priceDiscount : null,
    };
    const isDuplicate = variants.some((v) => v.size === variant.size && v.color === variant.color && v.storage === variant.storage);
    if (isDuplicate) {
      toast.error("Biến thể đã tồn tại!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`${SERVER_HOST}/variants`, variant);

      console.log("Phản hồi từ server:", response.data);
      reset();
      toast.success("Thêm thành công");
      setLoad((prev: any) => !prev);
      setOpenModal(false);
    } catch (error: any) {
      console.error("Lỗi khi gửi sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[1200px] h-[700px] rounded-lg shadow-lg relative p-5">
        <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
          <div>
            {/* Tên sản phẩm */}
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Màu sắc</label>
              <input {...register("color")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" />
              {errors.color && <p className="text-red text-sm mt-1">{errors.color.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Size</label>
              <input {...register("size")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" />
              {errors.size && <p className="text-red text-sm mt-1">{errors.size.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cấu hình</label>
              <input {...register("storage")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" />
              {errors.storage && <p className="text-red text-sm mt-1">{errors.storage.message}</p>}
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
                Giảm giá
              </label>
              <div>
                <div className="flex items-center mb-4">
                  <input
                    {...register("sale")}
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
                    {...register("sale")}
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
              {errors.sale && <p className="text-red text-sm mt-1">{errors.sale.message}</p>}
            </div>
            {sale == "true" && (
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
              <button disabled={isLoading} type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                {isLoading ? <ButtonLoading /> : "Thêm"}
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
    </div>
  );
};

export default ModelAddVariant;
