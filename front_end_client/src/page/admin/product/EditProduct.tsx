import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency } from "../../../util/Format";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import { useEffect, useState } from "react";
import { ICategory } from "../../../types/Category";
import { IBrand } from "../../../types/Brand";
import toast from "react-hot-toast";
import { IProduct } from "../../../types/Product";
import { useParams } from "react-router-dom";
import SnipperLoading from "../../../components/admin/SnipperLoading";
import MultiImageUploaderEdit from "../../../components/admin/MultiImageUploaderEdit";
import EditFroalaEditors from "./EditFroalaEditor";

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
    image: z.preprocess((val) => (Array.isArray(val) && val.length === 0 ? undefined : val), z.array(z.any()).min(1, "Vui lòng chọn ít nhất 1 ảnh").max(4, "Tối đa 4 ảnh").optional()),
    categoryId: z.number().positive("Vui lòng chọn 1 danh mục"),
    brandId: z.number().positive("Vui lòng chọn 1 thương hiệu"),
    isDiscount: z.string(),
    status: z.string(),
    stock: z.number().min(1, "Số lượng >=0"),
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

const EditProduct = () => {
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
      stock: 0,
    },
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [product, setProduct] = useState<IProduct>();
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [imageDelete, setImageDelete] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/products/${id}`);
        const productData: IProduct = responseProduct.data.data;
        const responseCategory = await axios.get(`${SERVER_HOST}/categories`);
        const categoryData = responseCategory.data.data.content;
        const responseBrand = await axios.get(`${SERVER_HOST}/brands`);
        const brandData = responseBrand.data.data;
        setCategories(categoryData);
        setBrands(brandData);
        setProduct(productData);
        setDetail(productData.detail);
        reset({
          price: productData.price || 0,
          priceDiscount: productData?.priceDiscount || undefined,
          name: productData.name || "",
          categoryId: productData.category.id,
          brandId: productData.brand.id,
          description: productData?.description || "",
          detail: productData?.detail || "",
          status: productData.status,
          isDiscount: productData?.discount ? "true" : "false",
          image: undefined,
          stock: productData?.stock || 0,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const onSubmit = async (data: ProductFormValues) => {
    console.log("Dữ liệu sản phẩm:", data);
    if (data.image) {
      // if(data.image.length + imageDelete.length == 0){
      //   toast.error("Vui lòng chọn ít nhất 1 ảnh");
      //   return;
      // }
    } else {
      if (product && JSON.parse(product.image).length - imageDelete.length == 0) {
        toast.error("Vui lòng chọn ít nhất 1 ảnh");
        return;
      }
    }
    const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("price", data.price.toString());
    // formData.append("isDiscount", data.isDiscount);
    // formData.append("categoryId", data.categoryId.toString());
    // formData.append("brandId", data.brandId.toString());
    // formData.append("status", data.status);
    // if (data.priceDiscount) formData.append("priceDiscount", data.priceDiscount.toString());
    // if (data.detail) formData.append("detail", data.detail);
    // if (data.description) formData.append("description", data.description);
    // if (imageDelete.length > 0) {
    //   imageDelete.forEach((image) => {
    //     formData.append("imageDelete[]", image);
    //   });
    // }
    // // Đính kèm tất cả ảnh vào FormData
    // if (data.image && data.image.length > 0) {
    //   data.image.forEach((file) => {
    //     formData.append("image", file);
    //   });
    // }
    const product2 = {
      name: data.name,
      price: data.price,
      discount: data.isDiscount == "true" ? true : false,
      categoryId: data.categoryId,
      brandId: data.brandId,
      status: data.status,
      detail: detail,
      priceDiscount: data.priceDiscount,
      description: data.description,
      imageDelete: imageDelete,
      stock: data.stock,
    };
    console.log("Dữ liệu sản phẩm:", product2);
    formData.append("product", new Blob([JSON.stringify(product2)], { type: "application/json" }));
    if (data.image && data.image.length > 0) {
      data.image.forEach((file) => {
        formData.append("files", file);
      });
    }
    try {
      const response = await axios.put(`${SERVER_HOST}/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Phản hồi từ server:", response.data);
      toast.success("Đã cập nhật");
    } catch (error: any) {
      console.error("Lỗi khi gửi sản phẩm:", error);
      if (error.response.data.code === 404) toast.error("Tên đã tồn tại");
      else toast.error("Internal server error");
    }
  };
  const [detail, setDetail] = useState<string>("");

  const price = watch("price");
  const priceDiscount = watch("priceDiscount");
  const categoryId = watch("categoryId");
  const description = watch("description");
  const brandId = watch("brandId");
  const isDiscount = watch("isDiscount");
  const status = watch("status");
  useEffect(() => {
    if (isDiscount === "false") {
      setValue("priceDiscount", undefined); // Reset priceSale khi chọn "Không"
    }
  }, [isDiscount, setValue]);
  if (isLoading) return <SnipperLoading />;
  return (
    <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sửa sản phẩm</h3>

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
              defaultValue={categoryId}
              id="category-create"
              {...register("categoryId", { valueAsNumber: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
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
              defaultValue={brandId}
              id="category-create"
              {...register("brandId", { valueAsNumber: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
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
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh sản phẩm</label>
          <MultiImageUploaderEdit setValue={setValue} defaultImages={product?.image} setImageDelete={setImageDelete} />
          {errors.image && <p className="text-red text-sm mt-1">{errors.image.message}</p>}
          <div className="mb-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={4}
              value={description}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Xuất bản
            </label>
            <select
              defaultValue={status}
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
          <EditFroalaEditors detail={detail} setDetail={setDetail} />
        </div>
        <div className="col-span-2">
          <div className="flex gap-4 my-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
