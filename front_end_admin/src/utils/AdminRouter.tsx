import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router";

const AdminRouter = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user && (user.role == "ADMIN" || user.role == "MANAGER") ? <Outlet /> : <Navigate to="/tables/product" replace />;
}

export default AdminRouter;