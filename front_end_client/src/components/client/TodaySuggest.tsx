import { useEffect, useState } from "react";
import ItemProductSlide from "./ItemProductSlide";
import SildeProduct from "./SildeProduct";
import { SERVER_HOST } from "../../config/Url";
import axios from "axios";
import { IProduct, IProductToday } from "../../types/Product";
import SnipperLoading from "../admin/SnipperLoading";
const products = [
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 1",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 2",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 3",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 4",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 5",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 6",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 7",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 8",
  },
];
const TodaySuggest = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/products-today`);
        setProducts(responseProduct.data.data.map((i: IProductToday) => i.product));
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
        <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">Gợi ý hôm nay</button>
      </h2>
      <div className="py-2">
        <div className="p-4 border border-primary rounded-lg">
          {/* {tabs.map((tab: any) => (activeTab === tab.id ? <div key={tab.id}>{tab.content}</div> : null))} */}
          {isLoading ? <SnipperLoading /> : <SildeProduct products={products} />}
        </div>
      </div>
    </div>
  );
};

export default TodaySuggest;
