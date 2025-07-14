import { useEffect, useState } from "react";
import { ICategory } from "../../types/Category";
import SwiperWrapper from "./SwiperWrapper";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import SnipperLoading from "../admin/SnipperLoading";
import ItemCategory from "./ItemCategory";

const SlideCategory = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseCategory = await axios.get(`${SERVER_HOST}/categories`);
        setCategories(responseCategory.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) return <SnipperLoading />;
  return (
    <SwiperWrapper slidesPerView={10} spaceBetween={0} loop={false} pagination={false}>
      {categories.map((item) => (
        <ItemCategory key={item.id} item={item} />
      ))}
    </SwiperWrapper>
  );
};

export default SlideCategory;
