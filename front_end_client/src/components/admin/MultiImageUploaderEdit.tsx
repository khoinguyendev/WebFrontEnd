import { useState } from "react";
import { SERVER_HOST } from "../../config/Url";
interface ImageUploaderEditProps {
  setValue: any;
  setImageDelete: any;
  defaultImages?: string;
}
const MultiImageUploaderEdit = ({ setValue, defaultImages, setImageDelete }: ImageUploaderEditProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>(defaultImages ? JSON.parse(defaultImages) : []);
  const rootImage: string[] = defaultImages ? JSON.parse(defaultImages) : [];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      setImages([...images, ...newImages]);
      setValue("image", [...images, ...newImages]);
      event.target.value = "";
    }
  };
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("image", updatedImages);
  };
  const removeImagePreview = (index: number, image: string) => {
    const updatedImages = previewImage.filter((_, i) => i !== index);
    setPreviewImage(updatedImages);
    const deleteImage = rootImage.find((img) => img == image);
    setImageDelete((pre: string[]) => [...pre, deleteImage]);
  };

  return (
    <div>
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
        Chọn ảnh
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {previewImage.map((image, index) => (
          <div key={index} className="relative">
            <img src={`${SERVER_HOST}/uploads/${image}`} alt="Uploaded" className="w-full h-40 object-cover rounded" />
            <button type="button" className="absolute top-0 right-0 bg-red text-white text-xs rounded-full p-1" onClick={() => removeImagePreview(index, image)}>
              X
            </button>
          </div>
        ))}
        {images.map((file, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-full h-40 object-cover rounded" />
            <button type="button" className="absolute top-0 right-0 bg-red text-white text-xs rounded-full p-1" onClick={() => removeImage(index)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploaderEdit;
