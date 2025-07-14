import { useState, useEffect } from "react";

const ImageUploader = ({ setValue, resetTrigger }: { setValue: any; resetTrigger: boolean }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      setValue("image", file);
      event.target.value = "";
    }
  };

  const removeImage = () => {
    setImage(null);
    setValue("image", null);
  };

  // ✅ Lắng nghe resetTrigger để reset ảnh khi form được reset
  useEffect(() => {
    setImage(null);
    setValue("image", null);
  }, [resetTrigger, setValue]);

  return (
    <div>
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
        Chọn ảnh
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
      {image && (
        <div className="relative w-20 my-3">
          <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
          <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1" onClick={removeImage}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
