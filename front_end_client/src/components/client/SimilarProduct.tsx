import { useEffect, useState } from "react";
import ItemSimilarProduct from "./ItemSimilarProduct";
import { IProduct } from "../../types/Product";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import SnipperLoading from "../admin/SnipperLoading";

const SimilarProduct = ({ product }: { product: IProduct | null }) => {
  if (!product) return null;
  const [products, setProducts] = useState<IProduct[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/products?categoryId=${product.category.id}`);
        setProducts(responseProduct.data.data.content.filter((p: IProduct) => p.id != product.id));
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
      <h2 className="border-b-primary border-b-4 ">
        <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">Sản phẩm tương tự</button>
      </h2>
      <div className="flex flex-col">{isLoading ? <SnipperLoading /> : products.map((product) => <ItemSimilarProduct product={product} key={product.id} />)}</div>
    </div>
  );
};

export default SimilarProduct;
