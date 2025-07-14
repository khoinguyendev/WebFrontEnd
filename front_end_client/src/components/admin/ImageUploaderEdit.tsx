import { useState, useEffect } from "react";
import { SERVER_HOST } from "../../config/Url";

interface ImageUploaderEditProps {
  setValue: any;
  defaultImage?: string;
}

const ImageUploaderEdit = ({ setValue, defaultImage }: ImageUploaderEditProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(defaultImage ? `${SERVER_HOST}/uploads/${defaultImage}` : null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
      setValue("image", file);
      event.target.value = "";
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage(null);
    setValue("image", null);
  };

  return (
    <div>
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
        Chọn ảnh
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>

      {previewImage && (
        <div className="relative w-20 my-3">
          <img src={previewImage} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
          <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1" onClick={removeImage}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploaderEdit;
