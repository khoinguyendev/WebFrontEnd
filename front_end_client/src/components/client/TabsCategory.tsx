import { useEffect, useState } from "react";
import SildeProduct from "./SildeProduct";
import { SERVER_HOST } from "../../config/Url";
import axios from "axios";
import { ICategory } from "../../types/Category";
import SnipperLoading from "../admin/SnipperLoading";
import { IProduct } from "../../types/Product";

const TabsCategory = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseCategory = await axios.get(`${SERVER_HOST}/categories?size=3&sort=position,desc&show=true`);
        const responseProduct = await axios.get(`${SERVER_HOST}/products?status=ACTIVE&categoryId=${responseCategory.data.data.content[0].id}`);
        setProducts(responseProduct.data.data.content);
        setCategories(responseCategory.data.data.content);
        setActiveTab(responseCategory.data.data.content[0].id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const getProductsTab = async (id: number) => {
    setActiveTab(id);
    const responseProduct = await axios.get(`${SERVER_HOST}/products?status=ACTIVE&categoryId=${id}`);
    setProducts(responseProduct.data.data.content);
  };
  if (isLoading) return <SnipperLoading />;

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="grid grid-cols-3 ">
        {categories.map((tab) => (
          <button
            key={tab.id}
            onClick={() => getProductsTab(tab.id)}
            className={`p-3 text-center text-black font-medium transition-all ${activeTab === tab.id ? "bg-tabs rounded-t-lg text-white" : "bg-[#eaedf1] hover:bg-gray-200"}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-4 bg-tabs rounded-b-lg">
        {/* {tabs.map((tab: any) => (activeTab === tab.id ? <div key={tab.id}>{tab.content}</div> : null))} */}
        <SildeProduct products={products} />
      </div>
    </div>
  );
};

export default TabsCategory;
