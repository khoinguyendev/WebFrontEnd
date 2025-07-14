import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/client/AppLayout";
import Home from "./page/client/Home";
import Login from "./page/client/Login";
import Register from "./page/client/Register";
import AdminLayout from "./layout/admin/AdminLayout";
import Product from "./page/admin/product/Product";
import Order from "./page/admin/Order";
import Dashboard from "./page/admin/Dashboard";
import LoginAdmin from "./page/admin/LoginAdmin";
import PrivateRouter from "./util/PrivateRouter";
import PageTitle from "./util/PageTitle";
import ProductDetail from "./page/client/ProductDetail";
import ProductCategory from "./page/client/ProductCategory";
import Search from "./page/client/Search";
import Cart from "./page/client/Cart";
import AddProduct from "./page/admin/product/AddProduct";
import AddCategory from "./page/admin/category/AddCategory";
import Category from "./page/admin/category/Category";
import EditCategory from "./page/admin/category/EditCategory";
import Brand from "./page/admin/brand/Brand";
import AddBrand from "./page/admin/brand/AddBrand";
import EditBrand from "./page/admin/brand/EditBrand";
import DeletedProduct from "./page/admin/product/DeletedProduct";
import EditProduct from "./page/admin/product/EditProduct";
import ProductToday from "./page/admin/productToday/ProductToday";
import Banner from "./page/admin/banner/Banner";
import AddBanner from "./page/admin/banner/AddBanner";
import EditBanner from "./page/admin/banner/EditBanner";
import Variant from "./page/admin/product/Variant";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "./config/Url";
import axios from "axios";
import { loginSuccess } from "./redux/authSlice";
import Payment from "./page/client/Payment";
import UserRouter from "./util/UserRouter";
import LoginGoogle from "./page/client/LoginGoogle";
import UploadImage from "./page/admin/image/UploadImage";
import GoogleLogin from "./page/client/google/GoogleLogin";
import TabMe from "./page/client/me/TabMe";
import ProfileOrder from "./page/client/me/ProfileOrder";
import NotifyOrder from "./page/client/notifyorder/NotifyOrder";
import NofifyMomo from "./page/client/notifyorder/NofifyMomo";
import ProfileInfo from "./page/client/me/ProfileInfo";
import ScrollToTop from "./util/ScrollToTop";
import Address from "./page/client/me/Address";
import NofifyVNPay from "./page/client/notifyorder/NotifyVNPay";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      // if (token) {
      //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      //   dispatch(loginSuccess(token)); // Lưu token vào Redux store
      // }
      if (token) {
        try {
          const response = await axios.get(`${SERVER_HOST}/users/my-info`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          dispatch(loginSuccess({ token: token, user: response.data.data }));
        } catch (error) {
          localStorage.removeItem("token");
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) return;

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Client Routes */}

          <Route path="/" element={<AppLayout />}>
            <Route element={<UserRouter />}>
              <Route path="/thong-tin-cua-toi" element={<TabMe />}>
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="Đơn hàng" />
                      <ProfileOrder />
                    </>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <>
                      <PageTitle title="Thông tin cá nhân" />
                      <ProfileInfo />
                    </>
                  }
                />
                <Route
                  path="address"
                  element={
                    <>
                      <PageTitle title="Địa chỉ" />
                      <Address />
                    </>
                  }
                />
              </Route>
            </Route>
            <Route
              index
              element={
                <>
                  <PageTitle title="Trang chủ" />
                  <Home />
                </>
              }
            />
            <Route
              path="dang-nhap"
              element={
                <>
                  <PageTitle title="Đăng nhập" />
                  <Login />
                </>
              }
            />
            <Route
              path="dang-ky"
              element={
                <>
                  <PageTitle title="Đăng kí" />
                  <Register />
                </>
              }
            />
            <Route
              path="cart"
              element={
                <>
                  <PageTitle title="Giỏ hàng" />
                  <Cart />
                </>
              }
            />
            <Route
              path="san-pham/:id"
              element={
                <>
                  <PageTitle title="Sản phẩm" />
                  <ProductDetail />
                </>
              }
            />
            <Route
              path="danh-muc/:id"
              element={
                <>
                  <PageTitle title="Danh mục" />
                  <ProductCategory />
                </>
              }
            />
            <Route
              path="search"
              element={
                <>
                  <PageTitle title="Tìm kiếm" />
                  <Search />
                </>
              }
            />
            <Route
              path="thanh-toan"
              element={
                <>
                  <PageTitle title="Thanh toán" />
                  <Payment />
                </>
              }
            />
            <Route
              path="/dat-hang-thanh-cong"
              element={
                <>
                  <PageTitle title="Đặt hàng thành công" />
                  <NotifyOrder />
                </>
              }
            />
            <Route
              path="/dat-hang-thanh-cong-momo"
              element={
                <>
                  <PageTitle title="Đặt hàng thành công" />
                  <NofifyMomo />
                </>
              }
            />
            <Route
              path="/dat-hang-thanh-cong-vnpay"
              element={
                <>
                  <PageTitle title="Đặt hàng thành công" />
                  <NofifyVNPay />
                </>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/sign-in" element={<LoginAdmin />} />
          <Route path="/login-google" element={<LoginGoogle />} />
          <Route path="/admin" element={<PrivateRouter />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="crud/list/products" element={<Product />} />
              <Route path="crud/variant/products/:id" element={<Variant />} />
              <Route path="crud/create/products" element={<AddProduct />} />
              <Route path="crud/edit/products/:id" element={<EditProduct />} />
              <Route
                path="crud/deleted/products"
                element={<DeletedProduct />}
              />
              <Route path="crud/list/category" element={<Category />} />
              <Route path="crud/create/category" element={<AddCategory />} />
              <Route path="crud/edit/category/:id" element={<EditCategory />} />
              <Route path="crud/list/brand" element={<Brand />} />
              <Route path="crud/create/brand" element={<AddBrand />} />
              <Route path="crud/edit/brand/:id" element={<EditBrand />} />
              <Route
                path="crud/list/product-today"
                element={<ProductToday />}
              />
              <Route path="crud/list/banners" element={<Banner />} />
              <Route path="crud/create/banners" element={<AddBanner />} />
              <Route path="crud/edit/banners/:id" element={<EditBanner />} />
              <Route path="crud/list/images" element={<UploadImage />} />
              <Route path="order" element={<Order />} />
            </Route>
          </Route>
          <Route path="/google/call-back" element={<GoogleLogin />} />

          {/* Not Found Route */}
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
