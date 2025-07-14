import { useState } from "react";

const ProductSpecification = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="font-bold text-gray1 text-xl">Thông số kỹ thuật</p>
      <table className="w-full border border-gray-300 my-2 text-gray1">
        <thead>
          <tr className="bg-gray-200">
            <th className="w-1/4 p-2 text-left border">Thuộc tính</th>
            <th className="w-3/4 p-2 text-left border">Giá trị</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border">
            <td className="p-2 border">The Sliding Mr The Sliding Mr</td>
            <td className="p-2 border">Malcolm Lockyer</td>
          </tr>
          <tr className="border">
            <td className="p-2 border">Witchy Woman</td>
            <td className="p-2 border">The Eagles</td>
          </tr>
          <tr className="border">
            <td className="p-2 border">Witchy Woman</td>
            <td className="p-2 border">The Eagles</td>
          </tr>
          <tr className="border">
            <td className="p-2 border">Witchy Woman</td>
            <td className="p-2 border">The Eagles</td>
          </tr>
        </tbody>
      </table>

      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`${open ? "bg-primary text-white" : "bg-white text-primary"} duration-500 w-full text-center border border-primary py-2 rounded`}
      >
        Xem cấu hình chi tiết
      </button>
    </div>
  );
};

export default ProductSpecification;
