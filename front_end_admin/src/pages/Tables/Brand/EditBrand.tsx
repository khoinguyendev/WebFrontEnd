import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SERVER_HOST } from "../../../configs/UrlServer";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { IBrand } from "../../../types/Brand";
import { useEffect, useState } from "react";
import SnipperLoading from "../../../utils/SnipperLoading";

const brandSchema = z.object({
    name: z.string().trim().min(1, "Tên thương hiệu không được để trống").transform((val) => val.replace(/\s+/g, " ")),
    description: z.string().optional(),

});
type BrandFormValues = z.infer<typeof brandSchema>;

const EditBrand = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            description: "",

        },
    });
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const responseBrand = await axios.get(`${SERVER_HOST}/brands/${id}`);
                const brandData: IBrand = responseBrand.data;
                console.log(brandData);
                reset({
                    name: brandData.name || "",
                    description: brandData.description || "",
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    const onSubmit = async (data: BrandFormValues) => {

        const brand = {
            name: data.name,
            description: data.description,
        };

        try {
            await axios.put(`${SERVER_HOST}/brands/${id}`, brand);
            toast.success("Cập nhật thương hiệu thành công");
        } catch (error: any) {
            console.error("Lỗi khi gửi sản phẩm:", error);
            if (error.response.data.statusCode === 409) toast.error("Tên đã tồn tại");
            else toast.error("Internal server error");
        }
    };
    if (isLoading) return <SnipperLoading />;

    return (
        <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cập nhật thương hiệu</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên</label>
                        <input {...register("name")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Nhập tên thương hiệu" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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
                    <div className="flex gap-4 my-4">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            Cập nhật
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

    )
}

export default EditBrand