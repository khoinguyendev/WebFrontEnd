import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import React, { ReactNode } from "react";
import { Swiper as SwiperClass } from "swiper";

interface SwiperWrapperProps {
  children: ReactNode;
  slidesPerView?: number;
  loop?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  spaceBetween?: number;
  onSwiper?: (swiper: SwiperClass) => void; // Thêm prop nhận instance
}

const SwiperWrapper = ({ children, pagination = true, slidesPerView = 1, loop = true, spaceBetween = 10, navigation = true, onSwiper }: SwiperWrapperProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      pagination={pagination ? { clickable: true } : undefined}
      loop={loop}
      navigation={navigation}
      onSwiper={onSwiper} // Truyền instance ra ngoài
      className="hh"
    >
      {React.Children.toArray(children).map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperWrapper;
