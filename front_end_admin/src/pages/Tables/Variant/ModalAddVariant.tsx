import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "../../../utils/Format";
import { IAttribute } from "../../../types/Attribute";
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import { IAttributeValue } from "../../../types/AttributeValue";
import Badge from "../../../components/ui/badge/Badge";
import toast from "react-hot-toast";
import ButtonLoading from "../../../utils/ButtonLoading";


const productVariantSchema = z.object({
    price: z.number({ invalid_type_error: "Giá phải là số" }).min(1000, "Giá phải lớn hơn 1.000").max(100000000, "Giá phải nhỏ hơn 100.000.000"),
    priceSale: z.number({ invalid_type_error: "Giá khuyến mãi phải là số" }).optional().nullable(),
    sku: z.string().optional(),
    stockQuantity: z.number({ invalid_type_error: "Số lượng phải là số" }).min(0, "Số lượng không được âm"),
    sale: z.string(), // dùng string cho select box "true"/"false", sau đó convert
    attributeId: z.number(),
    valueId: z.number(),
});

type ProductFormValues = z.infer<typeof productVariantSchema>;
const ModalAddVariant = ({ setOpenModal, productId }: { setOpenModal: (b: boolean) => void, productId: number }) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,

        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productVariantSchema),
        defaultValues: {
            price: 0,
            priceSale: undefined,
            sku: "",
            stockQuantity: 0,
            sale: "false",
            attributeId: 0,
            valueId: 0,
        },
    });
    const [attributes, setAttributes] = useState<IAttribute[]>([]);
    const [values, setValues] = useState<IAttributeValue[]>([]);

    const [isLoadingVal, setIsLoadingVal] = useState(false);
    const [listAttributes, setListAttributes] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/attributes`);
                setAttributes(response.data);

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    const onSubmit = async (data: ProductFormValues) => {

        const attributes = listAttributes.map((item) => {
            return {
                attributeId: item.attributeId,
                attributeValueId: item.attributeValueId,

            }
        })
        const productVariant = {
            productId: productId,
            price: data.price,
            priceSale: data.sale === "true" ? data.priceSale : 0,
            sku: data.sku,
            stockQuantity: data.stockQuantity,
            sale: data.sale === "true",
            attributes: attributes,
        }
        console.log("Dữ liệu gửi lên server:", productVariant);
        setIsLoading(true);
        try {
            const response = await axios.post(`${SERVER_HOST}/product-variants/attributes`, productVariant);
            console.log("Phản hồi từ server:", response.data);
            reset();
            toast.success("Thêm thành công");
        } catch (error: any) {
            console.error("Lỗi khi gửi sản phẩm:", error);
            if (error.response.data.statusCode === 409) toast.error("Tên đã tồn tại");
            else toast.error("Internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttributeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const attrId = parseInt(e.target.value);
        setValue("attributeId", attrId);
        setValue("valueId", 0); // reset giá trị

        if (!attrId) {
            setValues([]);
            return;
        }

        setIsLoadingVal(true);
        try {
            const response = await axios.get(`${SERVER_HOST}/attribute-values/${attrId}/values`);
            setValues(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingVal(false);
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    const price = watch("price");
    const sale = watch("sale");
    const selectedAttributeId = watch("attributeId");
    const selectedValueId = watch("valueId");
    const selectedAttribute = attributes.find(attr => attr.id === selectedAttributeId);
    const selectedValue = values.find(val => val.id === selectedValueId);
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-95 z-9999 px-4">
            <div className="bg-white w-full max-w-3xl h-[90vh] rounded-lg shadow-lg relative p-6 flex flex-col gap-4 overflow-hidden">
                {/* Nút đóng */}
                <button
                    disabled={isLoading}
                    onClick={() => setOpenModal(false)}
                    className="absolute top-2 right-2 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                    ✕
                </button>
                <div className="h-[90vh] overflow-y-auto rounded-lg">
                    <h2 className="text-xl font-semibold text-center">Thêm biến thể sản phẩm</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
                        <div>
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
                        </div>
                        <div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="mb-2">
                                    <label className="block mb-2 text-sm font-medium">Thuộc tính</label>
                                    <select
                                        {...register("attributeId", { valueAsNumber: true })}
                                        onChange={handleAttributeChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    >
                                        <option value={0}>Chọn thuộc tính</option>
                                        {attributes.map(attr => (
                                            <option key={attr.id} value={attr.id}>{attr.name}</option>
                                        ))}
                                    </select>
                                    {errors.attributeId && <p className="text-red-500 text-sm mt-1">{errors.attributeId.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block mb-2 text-sm font-medium">Giá trị</label>
                                    <select
                                        {...register("valueId", { valueAsNumber: true })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    >
                                        <option value={0}>Chọn giá trị</option>
                                        {values.map(val => (
                                            <option key={val.id} value={val.id}>{val.value}</option>
                                        ))}
                                    </select>
                                    {errors.valueId && <p className="text-red-500 text-sm mt-1">{errors.valueId.message}</p>}
                                </div>

                                {selectedAttribute && selectedValue && (
                                    <div className="col-span-2">
                                        <span className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {selectedAttribute.name}: <span className="text-green-500">{selectedValue.value}</span>
                                        </span>
                                        <button
                                            className="ms-4"
                                            type="button"
                                            onClick={() => {
                                                setAttributes(prev => prev.filter(attr => attr.id !== selectedAttribute.id));
                                                setValues(prev => prev.filter(val => val.id !== selectedValue.id));
                                                setListAttributes(prev => [...prev, { attributeId: selectedAttribute.id, attributeValueId: selectedValue.id, attribute: selectedAttribute.name, attributeValue: selectedValue.value }]);
                                                setValue("attributeId", 0);
                                                setValue("valueId", 0);
                                            }}
                                        >
                                            <Badge
                                                size="md"
                                                color={
                                                    "warning"
                                                }
                                            >Thêm</Badge>
                                        </button>
                                    </div>
                                )}

                            </div>

                        </div>
                        <div>
                            {listAttributes.map((attribute) => (
                                <p key={attribute.attributeId} className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {attribute.attribute}: <span className="text-green-500">{attribute.attributeValue}</span> <button
                                        className="ms-4"
                                        type="button"
                                        onClick={() => {
                                            setListAttributes(prev => prev.filter(attr => attr.attributeId !== attribute.attributeId));
                                            setAttributes(prev => [...prev, { id: attribute.attributeId, name: attribute.attribute }]);
                                            setValues(prev => [...prev, { id: attribute.attributeValueId, value: attribute.attributeValue }]);
                                            setValue("attributeId", 0);
                                            setValue("valueId", 0);
                                        }}
                                    >
                                        <Badge
                                            size="md"
                                            color={
                                                "error"
                                            }
                                        >Xóa</Badge>
                                    </button>
                                </p>
                            ))}
                        </div>
                        <div className="col-span-2">
                            <div className="flex gap-4 my-4">
                                <button disabled={isLoading} type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                    {isLoading ?<ButtonLoading/> : "Thêm"}
                                </button>
                                {/* <button
                            onClick={() => {
                                reset();
                            }}
                            type="reset"
                            className="bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-400"
                        >
                            Hủy
                        </button> */}
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    );
};

export default ModalAddVariant;
