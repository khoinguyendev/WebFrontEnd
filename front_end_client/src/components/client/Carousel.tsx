import { useEffect, useState } from "react";
import { IBanner } from "../../types/Banner";
import SwiperWrapper from "./SwiperWrapper";
import { SERVER_HOST } from "../../config/Url";
import axios from "axios";
import { Link } from "react-router-dom";
import { urlImage } from "../../util/Format";

const BanerItem = ({ banner }: { banner: IBanner }) => {
  return (
    <Link to={`${banner.link}`}>
      <img className="h-[400px] object-cover w-full" src={urlImage(banner.image)} alt={banner.link} />
    </Link>
  );
};
const Carousel = () => {
  const [banner, setBanner] = useState<IBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_HOST}/banners`);
        setBanner(response.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  return (
    <SwiperWrapper slidesPerView={1} spaceBetween={10} navigation={false}>
      {banner.map((banner) => (
        <BanerItem key={banner.id} banner={banner} />
      ))}
    </SwiperWrapper>
  );
};

export default Carousel;
