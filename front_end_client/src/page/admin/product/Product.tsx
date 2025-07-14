import { Link } from "react-router-dom";
import ItemProduct from "./ItemProduct";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../../config/Url";
import { IProduct } from "../../../types/Product";
import SnipperLoading from "../../../components/admin/SnipperLoading";
import toast from "react-hot-toast";
import ButtonLoading from "../../../components/admin/ButtonLoading";

const Product = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [load, setLoad] = useState(true);
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
  const handleDeleteChecked = async () => {
    setIsLoadingDelete(true);
    try {
      await axios.put(`${SERVER_HOST}/products/change/all?status=DELETED`, { ids: selectedIds });
      setSelectedIds([]);
      setLoad((pre) => !pre);
      toast.success("Đã xóa");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDelete(false);
    }
  };
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_HOST}/products`);
        setProducts(response.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [load]);
  return (
    <div>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">All products</h1>
          </div>
          <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
            <div className="flex items-center mb-4 sm:mb-0">
              <form className="sm:pr-3" action="#" method="GET">
                <label htmlFor="products-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="products-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search for products"
                  />
                </div>
              </form>
            </div>
            <div className="flex gap-2">
              <Link
                to={"/admin/crud/deleted/products"}
                type="button"
                className="block text-white bg-red focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg className="w-4 h-4 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to={"/admin/crud/create/products"}
                id="createProductButton"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                type="button"
                data-drawer-target="drawer-create-product-default"
                data-drawer-show="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                data-drawer-placement="right"
              >
                Add new product
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {selectedIds.length > 0 && (
              <button
                onClick={() => handleDeleteChecked()}
                className="my-2 text-white bg-[#c81e1e] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                type="button"
                disabled={isLoadingDelete}
                data-drawer-target="drawer-create-product-default"
                data-drawer-show="drawer-create-product-default"
                aria-controls="drawer-create-product-default"
                data-drawer-placement="right"
              >
                {isLoadingDelete ? <ButtonLoading /> : "Xóa đã chọn"}
              </button>
            )}
            <div className="overflow-hidden shadow">
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
                      <ItemProduct key={product.id} selectedIds={selectedIds} setLoad={setLoad} handleSelectItem={handleSelectItem} product={product} stt={index + 1} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
