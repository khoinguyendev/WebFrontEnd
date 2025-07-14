import { useEffect, useState } from "react";
import ItemProductSlide from "./ItemProductSlide";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import { ICategoryWithProducts } from "../../types/CategoryWithProducts";
import ProductSkeleton from "./Skeleton/ProductSkeleton";

const ContainerProduct = () => {
  const [categoryWithProducts, setCategoryWithProducts] = useState<ICategoryWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/categories/get-home-category-and-product`);
        setCategoryWithProducts(responseProduct.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        // Hiển thị 3 category giả + 5 sản phẩm skeleton mỗi category
        Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="my-10">
              <h2 className="border-b-primary border-b-4 my-2">
                <div className="bg-gray-200 w-[200px] h-[40px] rounded-t-lg animate-pulse"></div>
              </h2>
              <div className="grid grid-cols-5 gap-5">
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <ProductSkeleton key={idx} shadow />
                  ))}
              </div>
            </div>
          ))
      ) : (
        // Dữ liệu thực tế
        categoryWithProducts.map((item) => {
          const { category, products } = item;
          return (
            <div key={category.id} className="my-10">
              <h2 className="border-b-primary border-b-4 my-2">
                <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">{category.name}</button>
              </h2>
              <div className="grid grid-cols-5 gap-5">
                {products.map((product) => (
                  <ItemProductSlide key={product.id} product={product} shadow />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ContainerProduct;
