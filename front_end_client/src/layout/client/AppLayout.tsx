import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import NavBar from "./NavBar";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
