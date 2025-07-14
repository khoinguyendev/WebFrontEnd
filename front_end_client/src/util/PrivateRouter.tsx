import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  // const isAuthenticated = !!localStorage.getItem("isAuthenticated");
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/sign-in" replace />;
};

export default PrivateRouter;
