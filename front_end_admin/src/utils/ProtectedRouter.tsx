import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../redux/store";

const PrivateRouter = () => {
  const { isAuthenticated} = useSelector((state: RootState) => state.auth);
 
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRouter;
