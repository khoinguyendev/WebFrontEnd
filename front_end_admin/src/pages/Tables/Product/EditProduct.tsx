import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { ICategory } from "../../../types/Category";
import toast from "react-hot-toast";
import { IProduct } from "../../../types/Product";
import { useParams } from "react-router";
import { SERVER_HOST } from "../../../configs/UrlServer";
import SnipperLoading from "../../../utils/SnipperLoading";
import { formatCurrency } from "../../../utils/Format";
import ButtonLoading from "../../../utils/ButtonLoading";
import ImageMultiImageUpload from "../Image/ImageMultiImageUpload";
import { IBrand } from "../../../types/Brand";
import ListProductVariant from "./ListProductVariant";
import ModalAddVariant from "../Variant/ModalAddVariant";


const productSchema = z.object({
    name: z.string().trim().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự").transform((val) => val.replace(/\s+/g, " ")),
    description: z.string().optional(),
    detail: z.string().optional(),
    price: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1.000").max(100000000, "Giá phải nhỏ hơn 100.000.000"),
    priceSale: z.number({ invalid_type_error: "Giá khuyến mãi phải là số" }).min(0, "Giá phải lớn hơn 1000").max(100000000, "Giá phải nhỏ hơn 100.000.000").optional(),
    sku: z.string().optional(),
    stockQuantity: z.number({ invalid_type_error: "Số lượng phải là số" }).min(0, "Số lượng không được âm"),
    sale: z.string(), // dùng string cho select box "true"/"false", sau đó convert
    categoryId: z.number().positive("Vui lòng chọn 1 danh mục"),
    brandId: z.number().positive("Vui lòng chọn 1 thương hiệu"),
    // available: z.string(),
}).refine(
    (data) => {
      if (data.sale === "true" && data.sale !== undefined&& data.priceSale !== undefined) {
        return data.priceSale < data.price;
      }
      return true;
    },
    { message: "Giá sau khi giảm phải nhỏ hơn giá gốc", path: ["priceSale"] }
  );

type ProductFormValues = z.infer<typeof productSchema>;

const EditProduct = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            priceSale: undefined,
            sku: "",
            stockQuantity: 0,
            categoryId: 0,
            brandId: 0,
            // available: "false",
            sale: "false",
            detail: "",
        },
    });
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [variantId, setVariantId] = useState<number | null>(null);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [openModalAdd, setOpenModalAdd] = useState(false);

    const [p, setP] = useState<IProduct>();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [openModal, setOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const responseProduct = await axios.get(`${SERVER_HOST}/products/${id}`);
                const productData: IProduct = responseProduct.data;
                const responseCategory = await axios.get(`${SERVER_HOST}/categories`);
                const categoryData = responseCategory.data.data.content;
                const responseBrand = await axios.get(`${SERVER_HOST}/brands`);
                const brandData = responseBrand.data.data.content;
                console.log(productData);
                setBrands(brandData);
                setP(productData);
                setCategories(categoryData);
                setImageUrl(JSON.parse(productData.image));
                setVariantId(productData.variants[0].id);
                reset({
                    price: productData.variants[0].price || 0,
                    name: productData.name || "",
                    categoryId: productData.category.id,
                    brandId: productData.brand.id,
                    description: productData?.description || "",
                    detail: productData?.detail || "",
                    sku: productData?.variants[0].sku || "",
                    stockQuantity: productData?.variants[0].stockQuantity || 0,
                    sale: productData?.variants[0].sale ? "true" : "false",
                    priceSale: productData?.variants[0].priceSale || undefined,
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
        const product = {
            name: data.name,
            categoryId: data.categoryId,
            brandId:data.brandId,
            description: data.description,
            detail: data.detail,
            image: imageUrl,
        };
        const variant = {
            price: data.price,
            priceSale: data.sale == "true" ? data.priceSale : 0,
            sale: data.sale == "true",
            sku: data.sku,
            stockQuantity: data.stockQuantity
        };
        try {
            setLoadingBtn(true);
            await axios.put(`${SERVER_HOST}/products/${id}`, product);
            await axios.put(`${SERVER_HOST}/product-variants/${variantId}`, variant);
            toast.success("Cập nhật thành công");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoadingBtn(false);
        }
    };
    const price = watch("price");
    const categoryId = watch("categoryId");
    const description = watch("description");
    const detail = watch("detail");
    const sale = watch("sale");
     useEffect(() => {
    if (sale == "false") {
      setValue("priceSale", 0); // Reset priceSale khi chọn "Không"
    }
  }, [sale, setValue]);
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
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
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
                        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                    </div>
                    <div className="mb-2">
                        <label htmlFor="brand-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Thương hiệu
                        </label>
                        <select
                            defaultValue={0}
                            id="brand-create"
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
                        {errors.brandId && <p className="text-red-500-500 text-sm mt-1">{errors.brandId.message}</p>}
                    </div>
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
                        <label htmlFor="detail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Chi tiết
                        </label>
                        <textarea
                            {...register("detail")}
                            id="detail"
                            rows={4}
                            value={detail}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>
                    {/* Mã SKU */}
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mã hàng</label>
                        <input
                            type="text"
                            {...register("sku")}
                            className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="Nhập mã SKU"
                        />
                    </div>

                    {/* Số lượng trong kho */}
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số lượng tồn</label>
                        <input
                            type="number"
                            {...register("stockQuantity", { valueAsNumber: true })}
                            className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="Nhập số lượng"
                        />
                        {errors.stockQuantity && <p className="text-red-500-500 text-sm mt-1">{errors.stockQuantity.message}</p>}
                    </div>

                    {/* Đang khuyến mãi? */}
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đang khuyến mãi?</label>
                        <select
                            defaultValue="false"
                            {...register("sale")}
                            className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="false">Không</option>
                            <option value="true">Có</option>
                        </select>
                    </div>
                    {sale == "true" && <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá khuyến mãi</label>
                        <input
                            type="number"
                            {...register("priceSale", { valueAsNumber: true })}
                            className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="Nhập giá khuyến mãi"
                        />
                        {errors.priceSale && <p className="text-red-500 text-sm mt-1">{errors.priceSale.message}</p>}
                    </div>}
                    {/* Nút submit */}

                </div>

                {/* Ảnh sản phẩm */}
                <div>
                    <button
                        onClick={() => setOpenModal(true)}
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                        Chọn ảnh
                    </button>
                    <div className="flex flex-wrap gap-5">
                        {imageUrl && imageUrl.map((src) => <div key={src} className="relative w-60 my-3 ">
                            <img src={src} alt="Uploaded" className="w-60 h-40 object-scale-down rounded" />
                            <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1" onClick={() => setImageUrl((pre) => pre.filter(i => i != src))}>
                                X
                            </button>
                        </div>)}
                    </div>
                </div>
               
                <div className="flex gap-4 my-4 col-span-2">
                    <button disabled={loadingBtn} type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        {loadingBtn ? <ButtonLoading /> : "Cập nhật"}
                    </button>
                    {/* <button type="button" onClick={() => setOpenModalAdd(true)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Thêm biến thể
                    </button> */}
                </div>
            </form>
             {/* <div >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Danh sách biến thể</p>
                    <ListProductVariant  variants={p?.variants} />
                </div> */}
            {openModalAdd && <ModalAddVariant setOpenModal={setOpenModalAdd} productId={Number(id)}/>}

            {openModal && <ImageMultiImageUpload setOpenModal={setOpenModal} setImageUrl={setImageUrl} imageUrl={imageUrl} />}
        </div>

    );
};

export default EditProduct;
