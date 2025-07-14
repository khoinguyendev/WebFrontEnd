import { useEffect, useState } from "react";
import { IProduct, IProductToday } from "../../../types/Product";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import SnipperLoading from "../../../components/admin/SnipperLoading";
import ItemProduct from "../product/ItemProduct";
import toast from "react-hot-toast";
import ButtonLoading from "../../../components/admin/ButtonLoading";
interface ModelProductProps {
  setOpenModal: (o: boolean) => void;
  setLoad: (l: any) => void;
  productsToday: IProductToday[];
}
const ModelProduct = ({ setOpenModal, setLoad, productsToday }: ModelProductProps) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((product) => product.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectItem = (id: number) => {
    setSelectedIds((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((selectedId) => selectedId !== id) : [...prevSelected, id]));
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_HOST}/products`);
        setProducts(
          response.data.data.content.filter((p: IProduct) => {
            return !productsToday.some((pt) => pt.product.id === p.id);
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleAdd = async () => {
    setIsLoadingBtn(true);
    try {
      await axios.post(`${SERVER_HOST}/products-today`, { ids: selectedIds });
      setSelectedIds([]);
      setLoad((pre: boolean) => !pre);
      toast.success("Thêm thành công");
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingBtn(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center duration-400 justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[1200px] h-[600px] rounded-lg shadow-lg relative">
        <button
          disabled={isLoadingBtn}
          onClick={handleAdd}
          className="text-white my-3 mx-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          {isLoadingBtn ? <ButtonLoading /> : "Thêm"}
        </button>
        <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input id="checkbox-all" type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="p-4 w-[2rem] text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                <div className="flex items-cnter">STT</div>
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Tên sản phẩm
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Hình ảnh
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Giá
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Giảm giá
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Danh mục
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Thương hiệu
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Tình trạng
              </th>
              <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={100} className="text-center py-4">
                  <SnipperLoading />
                </td>
              </tr>
            ) : (
              products?.map((product, index) => (
                <ItemProduct edit={false} key={product.id} selectedIds={selectedIds} setLoad={setLoad} handleSelectItem={handleSelectItem} product={product} stt={index + 1} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelProduct;
