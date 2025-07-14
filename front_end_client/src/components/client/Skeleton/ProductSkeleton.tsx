const ProductSkeleton = ({ shadow = false }: { shadow?: boolean }) => {
  return (
    <div className={`block relative bg-white w-full rounded p-2 ${shadow && "shadow-lg"} animate-pulse`}>
      <div className="w-full h-[230px] p-3 mb-2 overflow-hidden bg-gray-200 rounded"></div>
      <div>
        <div className="h-[40px] bg-gray-200 rounded mb-2"></div>
        <div className="flex items-end gap-2 mb-2">
          <div className="w-[60px] h-[20px] bg-gray-200 rounded"></div>
          <div className="w-[40px] h-[14px] bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div className="w-[80px] h-[32px] bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="absolute flex flex-col gap-2 top-[10px] right-[10px]">
        <div className="w-[40px] h-[40px] bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
