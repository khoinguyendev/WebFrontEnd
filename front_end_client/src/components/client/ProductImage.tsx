import { useState } from "react";
import SwiperWrapper from "./SwiperWrapper";
import { Swiper as SwiperClass } from "swiper";

const ProductImage = ({ image }: { image: string | undefined }) => {
  if (!image) return null;
  
  const images = JSON.parse(image);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Lưu index ảnh đang hiển thị

  return (
    <>
      {/* Swiper chính hiển thị ảnh lớn */}
      <div>
        <SwiperWrapper
          slidesPerView={1}
          spaceBetween={0}
          loop={false}
          pagination={false}
          navigation={false}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            swiper.on("slideChange", () => setActiveIndex(swiper.activeIndex)); // Cập nhật index khi chuyển slide
          }}
        >
          {images.map((img: string) => (
            <div className="w-full py-3 flex justify-center" key={img}>
              <img className=" object-cover h-[350px]" src={img} />
            </div>
          ))}
        </SwiperWrapper>
      </div>

      {/* Swiper thumbnails */}
      <div>
        <SwiperWrapper slidesPerView={5} spaceBetween={10} loop={false} pagination={false} navigation={true}>
          {images.map((img: string, index: number) => (
            <div
              key={img}
              className={`w-full p-1 border rounded-lg cursor-pointer transition ${activeIndex === index ? "border-primary" : "border-gray-300"}`} // Thêm border khi active
              onClick={() => {
                swiperInstance?.slideTo(index);
                setActiveIndex(index); // Cập nhật index khi click vào thumbnail
              }}
            >
              <img className="w-[55px] object-cover h-[55px]" src={img} />
            </div>
          ))}
        </SwiperWrapper>
      </div>
    </>
  );
};

export default ProductImage;
