import { Outlet } from "react-router-dom";
import FooterAdmin from "./FooterAdmin";
import HeaderAdmin from "./HeaderAdmin";
import SlideBar from "./SlideBar";

const AdminLayout = () => {
  return (
    <div>
      <HeaderAdmin />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SlideBar />
        <div className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div className="main">
            <div className="px-4 pt-6">
              <Outlet />
            </div>
          </div>
          <FooterAdmin />
          <p className="my-10 text-sm text-center text-gray-500">
            © 2019-2025{" "}
            <a href="https://flowbite.com/" className="hover:underline" target="_blank">
              khoinguyen dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
