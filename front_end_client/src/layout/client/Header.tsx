import Logo from "@/assets/logo.webp";
import CallSvg from "@/assets/call.svg";
import User from "@/assets/users.svg";
import { Link } from "react-router-dom";
import LoginModal from "../../components/client/modal/LoginModal";
import RegisterModal from "../../components/client/modal/RegisterModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { closeModal, openModal, toggleAuthMode } from "../../redux/modalSlice";
import Search from "../../page/client/home/Search";

const Header = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { isOpen, isLogin } = useSelector((state: RootState) => state.modal);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <>
      <div className="custom-container px-5 xl:px-0 grid grid-cols-12 py-5">
        <div className="md:col-span-3 order-1 col-span-6">
          <Link to={"/"}>
            <img src={Logo} width={170} height={43} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="col-span-12 md:col-span-7 md:order-2 grid grid-cols-4 order-3">
          <div className="col-span-4 md:col-span-3">
            <Search />
          </div>
          {/* <div className="col-span-1 hidden lg:block">
            <div className="flex justify-center items-center gap-2">
              <div>
                <img src={CallSvg} width={30} height={30} alt="call" />
              </div>
              <div>
                <p className="text-sm">Tư vấn hỗ trợ</p>
                <span className="text-lg font-bold leading-5 text-primary">19006750</span>
              </div>
            </div>
          </div> */}
          <div className="col-span-1 hidden lg:block ms-5">
            <div className="flex items-center gap-2">
              <div>
                {token ? <img src={user?.avatar} className="rounded-full" width={30} height={30} alt="user" referrerPolicy="no-referrer" /> : <img src={User} width={30} height={30} alt="user" />}


              </div>
              <div>
                {token ? (
                  <>

                    <p className="text-sm">Xin chào!</p>
                    <span className="text-sm font-bold leading-5 text-primary cursor-pointer">{user?.name}</span>
                  </>
                ) : (
                  <>

                    <p className="text-sm">Xin chào!</p>
                    <span
                      className="text-sm font-bold leading-5 text-primary cursor-pointer"
                      onClick={() => dispatch(openModal({ isLogin: true }))}
                    >
                      Đăng nhập
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:order-3 md:col-span-2 flex justify-end items-center gap-3 order-2 ">
          {/* <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span className="w-[20px] h-[20px] absolute top-0 right-[-15px] rounded-full bg-primary text-white inline-block flex justify-center items-center">0</span>
          </div> */}
          <Link to={"/cart"} className="block relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <span className="w-[20px] h-[20px] absolute top-0 right-[-15px] rounded-full bg-primary text-white inline-block flex justify-center items-center">{cartItems.length}</span>
          </Link>
          <Link to={"/thong-tin-cua-toi"} className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>


            {/* <span className="w-[20px] h-[20px] absolute top-0 right-[-15px] rounded-full bg-primary text-white inline-block flex justify-center items-center">0</span> */}
          </Link>
        </div>
      </div>
      {isOpen &&
        (isLogin ? (
          <LoginModal
            setOpenModal={() => dispatch(closeModal())}
            setIsLogin={() => dispatch(toggleAuthMode())}
          />
        ) : (
          <RegisterModal
            setOpenModal={() => dispatch(closeModal())}
            setIsLogin={() => dispatch(toggleAuthMode())}
          />
        ))}    </>
  );
};

export default Header;
