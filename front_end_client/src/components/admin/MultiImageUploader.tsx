import { useEffect, useState } from "react";

const MultiImageUploader = ({ setValue, resetTrigger }: { setValue: any; resetTrigger: boolean }) => {
  const [images, setImages] = useState<File[]>([]);

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

  useEffect(() => {
    setImages([]);
    setValue("image", []);
  }, [setValue, resetTrigger]);
  return (
    <div>
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
        Chọn ảnh
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.map((file, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-full h-40 object-cover rounded" />
            <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1" onClick={() => removeImage(index)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploader;
