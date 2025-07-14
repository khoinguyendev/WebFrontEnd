import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ListProduct from "./pages/Tables/Product/ListProduct";
import ListImage from "./pages/Tables/Image/ListImage";
import AddProductNew from "./pages/Tables/Product/AddProduct";
import EditProduct from "./pages/Tables/Product/EditProduct";
import ListBrand from "./pages/Tables/Brand/ListBrand";
import AddBrand from "./pages/Tables/Brand/AddBrand";
import EditBrand from "./pages/Tables/Brand/EditBrand";
import ListCategory from "./pages/Tables/Category/ListCategory";
import AddCategory from "./pages/Tables/Category/AddCategory";
import EditCategory from "./pages/Tables/Category/EditCategory";
import ListBanner from "./pages/Tables/Banner/ListBanner";
import AddBanner from "./pages/Tables/Banner/AddBanner";
import EditBanner from "./pages/Tables/Banner/EditBanner";
import ListOrder from "./pages/Tables/Order/ListOrder";
import AddressStore from "./pages/Setting/AddressStore";
import ListUser from "./pages/Tables/User/ListUser";
import AddUser from "./pages/Tables/User/AddUser";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "./configs/UrlServer";
import axios from "axios";
import { loginSuccess } from "./redux/authSlice";
import { useDispatch } from "react-redux";
import PrivateRouter from "./utils/ProtectedRouter";
import ChangePassword from "./pages/Setting/ChangePassword";
import AdminRouter from "./utils/AdminRouter";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token-auth");
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
          localStorage.removeItem("token-auth");
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
          {/* Dashboard Layout */}
          <Route element={<PrivateRouter />}>
            <Route element={<AppLayout />}>
              <Route element={<AdminRouter />}>
                <Route index path="/" element={<Home />} />
                <Route path="/product/add" element={<AddProductNew />} />
                <Route path="/product/edit/:id" element={<EditProduct />} />

                <Route path="/tables/images" element={<ListImage />} />
                <Route path="/tables/brands" element={<ListBrand />} />
                <Route path="/tables/brand/add" element={<AddBrand />} />
                <Route path="/tables/brand/edit/:id" element={<EditBrand />} />
                <Route path="/tables/categories" element={<ListCategory />} />
                <Route path="/tables/category/add" element={<AddCategory />} />
                <Route path="/tables/category/edit/:id" element={<EditCategory />} />
                <Route path="/tables/banners" element={<ListBanner />} />
                <Route path="/tables/banner/add" element={<AddBanner />} />
                <Route path="/tables/banner/edit/:id" element={<EditBanner />} />

                <Route path="/tables/users" element={<ListUser />} />
                <Route path="/tables/user/add" element={<AddUser />} />
                {/* Settings */}

                <Route path="/address-store" element={<AddressStore />} />

               
              </Route>


              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/tables/product" element={<ListProduct />} />
              <Route path="/tables/orders" element={<ListOrder />} />
               <Route path="/change-password" element={<ChangePassword />} />
              {/* Pages */}
              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>


          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
