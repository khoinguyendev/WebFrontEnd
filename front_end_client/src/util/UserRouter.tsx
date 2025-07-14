import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const UserRouter = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default UserRouter;
