import { useState } from "react";
import { IBrand } from "../../../types/Brand";

const FilterModal = ({ setOpenModal, brands, onApplyFilter }: { 
    setOpenModal: any; 
    brands: IBrand[]; 
    onApplyFilter: (selectedBrandIds: number[], minPrice: number | null, maxPrice: number | null) => void;
}) => {
    const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    const handleBrandCheckbox = (id: number) => {
        setSelectedBrandIds(prev => 
            prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        onApplyFilter(selectedBrandIds, minPrice, maxPrice);
        setOpenModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[600px] rounded-lg shadow-lg relative p-6">
                <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>

                <div className="mt-4">
                    <h3 className="text-gray1 font-medium">Thương hiệu</h3>
                    <div className="flex flex-col mt-2">
                        {brands.map((brand) => (
                            <label key={brand.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-gray-500"
                                    checked={selectedBrandIds.includes(brand.id)}
                                    onChange={() => handleBrandCheckbox(brand.id)}
                                />
                                <span className="ml-2 text-gray1">{brand.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-gray1 font-medium">Giá</h3>
                    <div className="flex flex-col mt-2">
                        <label className="flex items-center mb-2">
                            <span className="mr-2 text-gray1">Từ:</span>
                            <input
                                type="number"
                                value={minPrice || ""}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                        </label>
                        <label className="flex items-center">
                            <span className="mr-2 text-gray1">Đến:</span>
                            <input
                                type="number"
                                value={maxPrice || ""}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={handleApply} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
