import { IProduct } from "../../types/Product";
import ItemProductSlide from "./ItemProductSlide";
import SwiperWrapper from "./SwiperWrapper";

const SildeProduct = ({ products }: { products: IProduct[] }) => {
  return (
    <SwiperWrapper slidesPerView={5} spaceBetween={10} loop={false} pagination={false} >
      {products && products.map((product, index) => <ItemProductSlide key={index} product={product} shadow={true}/>)}
    </SwiperWrapper>
  );
};

export default SildeProduct;
