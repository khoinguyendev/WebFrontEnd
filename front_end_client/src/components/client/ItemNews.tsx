import { useState } from "react";

const ItemNews = ({ news }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <a className="block " href="#" title="Săn sale thả ga" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="overflow-hidden">
        <img
          className={`lazyload loaded object-cover h-[210px] w-full scale-100 ${open && "scale-125"} duration-500`}
          src="https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg"
          alt="Sản phẩm thả ga"
        />
      </div>
      <div className="py-2">
        <h3 className="font-bold text-lg line-clamp-2">Tin tức mới nhất</h3>
        <p className="text-gray2 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </a>
  );
};

export default ItemNews;
