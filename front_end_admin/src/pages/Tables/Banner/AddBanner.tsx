import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ButtonLoading from "../../../utils/ButtonLoading";
import toast from "react-hot-toast";
import { SERVER_HOST } from "../../../configs/UrlServer";
import axios from "axios";
import ImageUploaderNew from "../Image/ImageUploaderNew";
import FroalaEditorWord from "../../../components/ui/pagination/FroalaEditorWord";

const BannerSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống"),
  position: z.string(),
  link: z.string()
});

type BannerFormValues = z.infer<typeof BannerSchema>;
const AddBanner = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      title: "",
      position: "HEADER",
      link: "",
    },
  });
  const onSubmit = async (data: BannerFormValues) => {
    if (!imageUrl) toast.error("Vui lòng chọn ảnh");
    if (!content) toast.error("Vui lòng nhập nội dung");
    const banner = {
      position: data.position,
      link: data.link,
      title: data.title,
      image: imageUrl,
      content: content,
    };
    console.log("banner", banner);
    try {
      await axios.post(`${SERVER_HOST}/banners`, banner);
      reset();
      setImageUrl("");
      toast.success("Thêm thành công");
    } catch (error) {
      console.error("Lỗi k:", error);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [content,setContent] = useState("");
  return (
    <div className="p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thêm banner</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 mt-4">
        <div>
          
          <div className="mb-2">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tiêu đề
            </label>
            <input
              {...register("title")}
              id="title"
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề banner"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link</label>
            <input {...register("link")} className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" placeholder="Nhập link banner" />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
          </div>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vị trí</label>
            <select
              defaultValue="HEADER"
              {...register("position")}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            >
              <option value="HEADER">Đầu trang</option>
              <option value="MAIN">Giữa trang</option>
              <option value="FOOTER">Cuối trang</option>
            </select>
          </div>
         
        </div>
        <div>
          <button
            onClick={() => setOpenModal(true)}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            Chọn ảnh
          </button>
          {imageUrl && (
            <div className="relative w-20 my-3">
              <img src={imageUrl} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
              <button type="button" className="absolute top-0 right-0 bg-red text-white text-xs rounded-full p-1" onClick={() => setImageUrl("")}>
                X
              </button>
            </div>
          )}
        </div>
        <div className="col-span-2">
          <FroalaEditorWord setDetail={setContent} />
        </div>
        <div className="col-span-2">
           <div className="flex gap-4 my-4">
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              {isSubmitting ? <ButtonLoading /> : "Thêm banner"}
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
       
      {openModal && <ImageUploaderNew setOpenModal={setOpenModal} setImageUrl={setImageUrl} />}
    </div>
  )
}

export default AddBanner