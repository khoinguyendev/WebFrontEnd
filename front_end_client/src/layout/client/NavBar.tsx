import { useEffect, useState } from "react";
import { ICategory } from "../../types/Category";
import { SERVER_HOST } from "../../config/Url";
import axios from "axios";
import SnipperLoading from "../../components/admin/SnipperLoading";
import { Link } from "react-router-dom";
import { urlImage } from "../../util/Format";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

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
  return (
    <div className="bg-primary w-full hidden md:block">
      <div className="custom-container py-3 text-white  grid grid-cols-9">
        <div style={{ borderRight: "1px solid white" }} className="relative col-span-2 flex gap-2 cursor-pointer" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>

          <p className="font-bold text-[15px]">Danh mục sản phẩm</p>
          <div className="absolute bg-transparent right-0 left-0 h-[10px] top-[20px]"></div>
          <ul className={`absolute w-full z-10 top-[30px] shadow-lg text-black bg-white duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            {isLoading ? (
              <SnipperLoading />
            ) : (
              <>
                {categories.length === 0 ? (
                  <p className="text-sm text-center">Không có danh mục nào</p>
                ) : (
                  categories.map((category) => (
                    <li key={category.id} className="text-gray1 text-[15px] hover:bg-yellow_btn hover:text-white">
                      <Link to={`/danh-muc/${category.id}`} className="flex items-center gap-2 p-2">
                        <img className="h-[30px] w-[30px] object-cover rounded-full" src={urlImage(category.image)} alt={category.name} />
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  ))
                )}
              </>
            )}
          </ul>
        </div>
        {/* <div className="col-span-7">
          <ul className="flex">
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Trang chủ
              </a>
            </li>
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Giới thiệu
              </a>
            </li>
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Tin mới nhất
              </a>
            </li>
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Tuyển dụng
              </a>
            </li>
            <li>
              <a className="text-sm px-1 lg:px-4 lg:text-base" href="#">
                Liên hệ
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default NavBar;
