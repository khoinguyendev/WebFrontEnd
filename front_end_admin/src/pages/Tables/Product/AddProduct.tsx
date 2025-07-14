import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { ICategory } from "../../../types/Category";
import toast from "react-hot-toast";
import { SERVER_HOST } from "../../../configs/UrlServer";
import { formatCurrency } from "../../../utils/Format";
import ImageMultiImageUpload from "../Image/ImageMultiImageUpload";
import { IBrand } from "../../../types/Brand";


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
        if (data.sale === "true" && data.sale !== undefined&&data.priceSale !== undefined) {
            return data.priceSale < data.price;
        }
        return true;
    },
    { message: "Giá sau khi giảm phải nhỏ hơn giá gốc", path: ["priceSale"] }
);

type ProductFormValues = z.infer<typeof productSchema>;

const AddProductNew = () => {
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
            priceSale: 0,
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
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const responseCategory = await axios.get(`${SERVER_HOST}/categories`);
                const categoryData = responseCategory.data.data.content;
                setCategories(categoryData);
                const responseBrand = await axios.get(`${SERVER_HOST}/brands`);
                const brandData = responseBrand.data.data.content;
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
        console.log("data", data);
        const product = {
            name: data.name,
            detail: data.detail,
            description: data.description,
            brandId: data.brandId,
            categoryId: data.categoryId,
            variant: {
                price: data.price,
                priceSale: data.sale == "true" ? data.priceSale : 0,
                sale: data.sale == "true",
                sku: data.sku,
                stockQuantity: data.stockQuantity
            },
            image: imageUrl,
        };

        try {
            const response = await axios.post(`${SERVER_HOST}/products/variant-none`, product);

            console.log("Phản hồi từ server:", response.data);
            reset();
            setImageUrl([]);
            toast.success("Thêm thành công");
        } catch (error: any) {
            console.error("Lỗi khi gửi sản phẩm:", error);
            if (error.response.data.statusCode === 409) toast.error("Tên đã tồn tại");
            else toast.error("Internal server error");
        }
    };
    const isDiscount = watch("sale");


    const price = watch("price");
    const sale = watch("sale");
    useEffect(() => {
        if (isDiscount === "false") {
            setValue("priceSale", 0); // Reset priceSale khi chọn "Không"
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
                        {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
                    </div>

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
                        {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>}
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
                    {/* <div className="mb-2">
                        <label htmlFor="category-create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Xuất bản
                        </label>
                        <select
                            defaultValue="false"
                            {...register("available")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                            <option value="false">Không xuất bản</option>
                            <option value="true">Xuất bản</option>
                        </select>
                        {errors.available && <p className="text-red-500 text-sm mt-1">{errors.available.message}</p>}
                    </div> */}
                    {/* Nút submit */}
                    <div className="flex gap-4 my-4">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            Thêm sản phẩm
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
                        {imageUrl && imageUrl.map((src) => <div className="relative w-60 my-3 ">
                            <img src={src} alt="Uploaded" className="w-60 h-40 object-scale-down rounded" />
                            <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1" onClick={() => setImageUrl((pre) => pre.filter(i => i != src))}>
                                X
                            </button>
                        </div>)}
                    </div>
                </div>
            </form>
            {openModal && <ImageMultiImageUpload setOpenModal={setOpenModal} setImageUrl={setImageUrl} imageUrl={imageUrl} />}
        </div>
    );
};

export default AddProductNew;
