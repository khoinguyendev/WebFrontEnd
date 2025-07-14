import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { SERVER_HOST } from '../../../config/Url'; // Đảm bảo rằng URL API là chính xác

const UploadImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Handle chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles([...selectedFiles]);
    }
  };

  // Handle submit form để upload ảnh
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ảnh!');
      return;
    }

    setIsUploading(true);

    // Tạo FormData để gửi file
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${SERVER_HOST}/UploadImage/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Giả sử API trả về một danh sách URL ảnh đã upload
      const uploadedUrls = response.data.map((image: { url: string }) => image.url);
      setUploadedImages(uploadedUrls);

      toast.success('Tải ảnh lên thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải ảnh lên!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-image-container">
      <h2 className="text-xl font-semibold mb-4">Tải ảnh lên</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input chọn file */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Chọn ảnh
          </label>
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Nút submit */}
        <div>
          <button
            type="submit"
            disabled={isUploading}
            className={`${
              isUploading ? 'bg-gray-500' : 'bg-blue-600'
            } text-white py-2 px-4 rounded-lg hover:bg-blue-700`}
          >
            {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
          </button>
        </div>
      </form>

      {/* Hiển thị ảnh đã tải lên */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Ảnh đã tải lên:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md">
                <img src={url} alt={`Uploaded ${index}`} className="w-full h-32 object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
