import { useState, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max }) => {
  const [value1, setValue1] = useState(min + (max - min) * 0.2);
  const [value2, setValue2] = useState(min + (max - min) * 0.5);

  const handleDrag = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Math.min(Math.max(Number(event.target.value), min), max);
      if (newValue > value1) {
        if (newValue > value2) {
          setValue2(newValue); // Sửa lại: value1 phải được cập nhật bình thư��ng
        } else {
          if (newValue - value1 < Math.abs(newValue - value2)) {
            setValue1(newValue);
          } else {
            setValue2(newValue); // Sửa lại: value1 phải được cập nhật bình thư��ng
          }
        }
      } else setValue1(newValue); // Sửa l��i: value2 phải được cập nhật bình thư��ng
    },
    [value1, value2, min, max]
  );

  const percent1 = ((value1 - min) / (max - min)) * 100;
  const percent2 = ((value2 - min) / (max - min)) * 100;
  return (
    <div className="flex w-64 m-auto items-center h-32 justify-center">
      <div className="py-1 relative min-w-full">
        <div className="h-2 bg-gray-200 rounded-full relative">
          <div className="absolute h-2 rounded-full bg-teal-600" style={{ width: `${percent2 - percent1}%`, left: `${percent1}%` }}></div>

          {/* Input slider 1 */}
          <input type="range" min={min} max={max} value={value1} onChange={(e) => handleDrag(e)} className="absolute w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          <div className="absolute h-4 w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 -top-[4px] cursor-pointer" style={{ left: `${percent1}%` }}>
            <div className="relative -mt-2 w-1">
              <div className="absolute z-40 bottom-100 mb-2 left-0 min-w-full" style={{ marginLeft: "-25px" }}>
                <div className="relative shadow-md">
                  <div className="bg-black -mt-8 text-white text-xs rounded py-1 px-4">${value1}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Input slider 2 */}
          <input type="range" min={min} max={max} value={value2} onChange={(e) => handleDrag(e)} className="absolute w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          <div className="absolute h-4 w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 -top-[4px] cursor-pointer" style={{ left: `${percent2}%` }}>
            <div className="relative -mt-2 w-1">
              <div className="absolute z-40 bottom-100 mb-2 left-0 min-w-full" style={{ marginLeft: "-25px" }}>
                <div className="relative shadow-md">
                  <div className="bg-black -mt-8 text-white text-xs rounded py-1 px-4">${value2}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Giá trị min max */}
          <div className="absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6">${min}</div>
          <div className="absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6">${max}</div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
