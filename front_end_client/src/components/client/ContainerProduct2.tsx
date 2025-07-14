import { Link } from "react-router-dom";
import ItemProductSlide from "./ItemProductSlide";
import SwiperWrapper from "./SwiperWrapper";
import { useEffect, useState } from "react";
import { IProduct } from "../../types/Product";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";

const images = [
  "https://bizweb.dktcdn.net/100/429/689/themes/869367/assets/banner_fashion_1.jpg?1705909623213",
  "https://bizweb.dktcdn.net/100/429/689/themes/869367/assets/banner_fashion_1.jpg?1705909623213",
];
const ContainerProduct2 = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/products?status=ACTIVE&categoryId=24`);
        setProducts(responseProduct.data.data.content);
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
        <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">Đồ công nghệ</button>
      </h2>
      <div className="grid grid-cols-12 py-2 bg-primary gap-2">
        <div className="hidden col-span-4 lg:flex py-2">
          <SwiperWrapper slidesPerView={1} spaceBetween={0} loop={false} pagination={true} navigation={false}>
            {images.map((item, index) => (
              <Link to="#">
                <img className="lazyload loaded w-full object-cover h-full" src={item} alt="Slide 1" data-src={item} data-was-processed="true" />
              </Link>
            ))}
          </SwiperWrapper>
        </div>

        {products.map((item, index) => (
          <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3">
            <ItemProductSlide key={index} product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContainerProduct2;
