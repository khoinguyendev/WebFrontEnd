import { useState } from "react";

const Toggle = () => {
  const [value, setValue] = useState(false);

  const toggleValue = () => {
    setValue(!value);
  };

  return (
    <div>
      {/* Hiển thị trạng thái hiện tại */}

      {/* Nút Toggle */}
      <div className="flex items-center m-2 cursor-pointer" onClick={toggleValue}>
        {/* <span className="font-semibold text-xs mr-1">Off</span> */}
        <div className={`rounded-full w-9 h-5 p-0.5 bg-gray-300 transition-all duration-300 ease-in-out ${value === false ? "" : "bg-[#ffb416]"}`}>
          <div className={`rounded-full w-4 h-4 bg-white transform mx-auto duration-300 ${value === false ? "-translate-x-2" : "translate-x-2"}`} />
        </div>
        <span className="text-gray1 text-sm ms-2">Apple</span>
        {/* <span className="font-semibold text-xs ml-1">On</span> */}
      </div>
    </div>
  );
};

export default Toggle;
