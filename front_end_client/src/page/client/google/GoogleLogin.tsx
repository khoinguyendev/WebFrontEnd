import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../../types/User";
import { loginSuccess } from "../../../redux/authSlice";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/auth/oauth2/success`, { withCredentials: true });
        const token: string = response.data.token;
        const user: IUser = response.data.user;
        dispatch(loginSuccess({ token, user }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex space-x-2 justify-center items-center bg-black h-screen dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-8 w-8 bg-white rounded-full animate-bounce" />
    </div>
  );
};

export default GoogleLogin;
