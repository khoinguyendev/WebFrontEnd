import Bread from "@/components/client/Bread";
import { IProduct } from "../../types/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import { useParams } from "react-router-dom";
import ItemProductSlide from "../../components/client/ItemProductSlide";
import { IBrand } from "../../types/Brand";
import FilterModal from "../../components/client/modal/FilterModal";
import Pagination from "../../components/client/Pagination";

const sort = [
  "Nổi bật",
  "Mới nhất",
  "Giảm giá",
  "Giá thấp đến cao",
  "Giá cao đến thấp",
];

const ProductCategory = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [active, setActive] = useState(sort[0]);
  const { id } = useParams();
  const getSortParam = (active: string) => {
    switch (active) {
      case "Mới nhất":
        return "createdAt,desc";
      case "Giảm giá":
        return "discount,desc"; // giả sử bạn có field "discount"
      case "Giá thấp đến cao":
        return "price,asc";
      case "Giá cao đến thấp":
        return "price,desc";
      default:
        return "id,desc"; // Nổi bật (mặc định)
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (isFiltered) return;
      setIsLoading(true);
      try {
        const sortParam = getSortParam(active);
        const urlParams = new URLSearchParams({
          categoryId: id || "",
          ...(brandId ? { brandId: brandId.toString() } : {}),
          sort: sortParam,
          page: (pageCurrent - 1).toString(),
          size: "10",
        });

        const url =
          active === "Mới nhất" || active === "Nổi bật"
            ? `${SERVER_HOST}/products?${urlParams.toString()}`
            : `${SERVER_HOST}/products/sort?${urlParams.toString()}`;

        const responseProduct = await axios.get(url);
        if (totalPages != responseProduct.data.data.totalPages)
          setTotalPages(responseProduct.data.data.totalPages);

        setProducts(responseProduct.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, active, brandId,pageCurrent]);
  const cancelFilter = () => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sortParam = getSortParam(active);
        const urlParams = new URLSearchParams({
          categoryId: id || "",
          ...(brandId ? { brandId: brandId.toString() } : {}),
          sort: sortParam,
          page: (pageCurrent - 1).toString(),
          size: "10",
        });

        const url =
          active === "Mới nhất" || active === "Nổi bật"
            ? `${SERVER_HOST}/products?${urlParams.toString()}`
            : `${SERVER_HOST}/products/sort?${urlParams.toString()}`;

        const responseProduct = await axios.get(url);
        if (totalPages != responseProduct.data.data.totalPages)
          setTotalPages(responseProduct.data.data.totalPages);

        setProducts(responseProduct.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    setIsFiltered(false);
  };
  useEffect(() => {
    setBrandId(null);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${SERVER_HOST}/brands/by-category?categoryId=${id}`
        );
        setBrands(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const hanldeFilter = (active: string) => {
    setActive(active);
    setPageCurrent(1);
  };
  const handleBrandFilter = (id: number | null) => {
    setBrandId(id);
    setPageCurrent(1);
  };
  const handleApplyFilter = (
    brandIds: number[],
    min: number | null,
    max: number | null
  ) => {
    const fetchData = async () => {
      setIsLoading(true);
      setPageCurrent(1);
      try {
        const response = await axios.post(`${SERVER_HOST}/products/filter?page=${pageCurrent-1}`, {
          brandIds,
          minPrice: min,
          maxPrice: max,
          categoryId: id,
        });
         if (totalPages != response.data.data.totalPages)
          setTotalPages(response.data.data.totalPages);
        setProducts(response.data.data.content);
        setIsFiltered(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };
  return (
    <div className="bg-[#fcfcfc]">
      <div className="custom-container py-4 ">
        <Bread title="Danh mục" />

        <div className="grid grid-cols-12 my-2">
          <div className="col-span-12">
            {isFiltered ? (
              <div className="flex items-center mb-2">
                <span
                  className="text-sm"
                  style={{ color: "rgba(71,84,103,1)" }}
                >
                  Lọc theo:
                </span>
                <button className="text-sm ml-2" onClick={() => cancelFilter()}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <span
                    className="text-sm"
                    style={{ color: "rgba(71,84,103,1)" }}
                  >
                    Thương hiệu:
                  </span>
                  <ul className="flex">
                    <li className="p-2">
                      <button
                        onClick={() => handleBrandFilter(null)}
                        className="text-sm"
                        style={{
                          color:
                            brandId == null
                              ? "rgba(42, 131, 233, 1)"
                              : "rgba(102,112,133,1)",
                        }}
                      >
                        Tất cả
                      </button>
                    </li>
                    {brands.map((item) => (
                      <li key={item.id} className="p-2">
                        <button
                          onClick={() => handleBrandFilter(item.id)}
                          className="text-sm"
                          style={{
                            color:
                              brandId === item.id
                                ? "rgba(42, 131, 233, 1)"
                                : "rgba(102,112,133,1)",
                          }}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="bg-[#f0f0f0] p-2 rounded flex items-center text-sm text-gray1"
                    onClick={() => setOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                      />
                    </svg>
                    <span>Lọc</span>
                  </button>
                </div>

                <div className="flex items-center">
                  <span
                    className="text-sm"
                    style={{ color: "rgba(71,84,103,1)" }}
                  >
                    Sắp xếp theo:
                  </span>
                  <ul className="flex">
                    {sort.map((item) => (
                      <li key={item} className="p-2">
                        <button
                          onClick={() => hanldeFilter(item)}
                          className="text-sm"
                          style={{
                            color:
                              active == item
                                ? "rgba(42, 131, 233, 1)"
                                : "rgba(102,112,133,1)",
                          }}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="grid grid-cols-5 gap-3 mt-2">
              {products.map((item, index) => (
                <ItemProductSlide key={index} product={item} shadow={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {open && (
        <FilterModal
          setOpenModal={setOpen}
          brands={brands}
          onApplyFilter={handleApplyFilter}
        />
      )}
      {totalPages != null && totalPages > 0 && (
       <div className="mt-4 flex items-center justify-center">
         <Pagination
           pageCurrent={pageCurrent}
           setPageCurrent={setPageCurrent}
           totalPages={totalPages}
         />
       </div>
      )}
    </div>
  );
};

export default ProductCategory;
