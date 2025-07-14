import { useState, useEffect } from "react";
import { IVariant } from "../../../types/Variant";

const ProductOptions = ({ variants, onSelectVariant }: { variants: IVariant[]; onSelectVariant: (variant: IVariant | null) => void }) => {
  // Lọc danh sách màu, size, storage
  const colors = [...new Set(variants.map((p) => p.color))];
  const sizes = [...new Set(variants.map((p) => p.size).filter(Boolean))];
  const storages = [...new Set(variants.map((p) => p.storage).filter(Boolean))];

  // Trạng thái lựa chọn
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedStorage, setSelectedStorage] = useState(storages[0] || "");

  // Lấy biến thể phù hợp dựa trên lựa chọn
  useEffect(() => {
    const selectedVariant = variants.find((v) => v.color === selectedColor && (v.size === selectedSize || !v.size) && (v.storage === selectedStorage || !v.storage)) || null;
    console.log(selectedVariant);
    onSelectVariant(selectedVariant);
  }, [selectedColor, selectedSize, selectedStorage, variants, onSelectVariant]);

  return (
    <div className="space-y-2">
      {/* Màu sắc */}
      {colors.length > 0 && (
        <div>
          <p className="font-bold text-sm">Màu sắc</p>
          <div className="flex gap-4">
            {colors.map((color) => (
              <button
                key={color}
                className={`flex items-center px-2 py-1 rounded-xl ${selectedColor === color ? "border-2 border-blue-200" : ""}`}
                onClick={() => setSelectedColor(color ? color : "")}
              >
                <span style={{ backgroundColor: color || "black" }} className={`rounded-full h-4 w-4 me-2`}></span>
                <span className="font-bold text-sm">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <p className="font-bold text-sm">Size</p>
          <div className="flex gap-4">
            {sizes.map((size) => (
              <button key={size} className={`px-3 py-1 rounded-xl ${selectedSize === size ? "border-2 border-blue-200" : ""}`} onClick={() => setSelectedSize(size ? size : "")}>
                <span className="font-bold text-sm">{size}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage */}
      {storages.length > 0 && (
        <div>
          <p className="font-bold text-sm">Dung lượng</p>
          <div className="flex gap-4">
            {storages.map((storage) => (
              <button key={storage} className={`px-3 py-1 rounded-xl ${selectedStorage === storage ? "border-2 border-blue-200" : ""}`} onClick={() => setSelectedStorage(storage ? storage : "")}>
                <span className="font-bold text-sm">{storage}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
