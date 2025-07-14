import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { SERVER_HOST } from "../../../configs/UrlServer";
import ButtonLoading from "../../../utils/ButtonLoading";

const ModalAddImage = ({ setOpenModal,setLoad }: { setOpenModal: (b: boolean) => void,setLoad:any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      const validImages = newImages.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
        const isValidSize = file.size <= 3 * 1024 * 1024;

        if (!isValidType) toast.error(`File ${file.name} không hợp lệ.`);
        if (!isValidSize) toast.error(`File ${file.name} vượt quá 3MB.`);

        return isValidType && isValidSize;
      });

      if (validImages.length > 0) {
        setImages((prev) => [...prev, ...validImages]);
      }

      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const hanldeAdd = async () => {
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      images.forEach((file) => formData.append("files", file));

      const response = await axios.post(`${SERVER_HOST}/files/upload/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Phản hồi từ server:", response.data);
      toast.success("Tải ảnh thành công");
      setImages([]);
      setLoad((pre:any)=>!pre)
      setOpenModal(false);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      toast.error("Đã xảy ra lỗi khi tải ảnh.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-95 z-9999 px-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-lg relative p-6 flex flex-col gap-4 overflow-hidden">
        {/* Nút đóng */}
        <button
          disabled={isLoading}
          onClick={() => setOpenModal(false)}
          className="absolute top-2 right-2 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          ✕
        </button>

        {/* Input chọn ảnh */}
        <label className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium w-fit hover:bg-blue-700 transition">
          Chọn ảnh
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Preview ảnh */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-40 object-contain rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nút Thêm */}
        {images.length > 0 && (
          <div className="mt-2 self-end">
            <button
              onClick={hanldeAdd}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition"
            >
              {isLoading ? <ButtonLoading /> : "Thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalAddImage;
