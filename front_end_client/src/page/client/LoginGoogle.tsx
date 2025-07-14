import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginGoogle = () => {
  const navigate = useNavigate();

  const initiateGoogleLogin = () => {
    // Chuyển hướng đến backend Google login
    window.location.href = 'https://localhost:7056/api/Auth/google-login';
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Lấy token từ URL

    if (token) {
      // Lưu token vào localStorage hoặc sessionStorage
      localStorage.setItem('auth_token', token);
      navigate('/dashboard');  // Điều hướng người dùng đến trang Dashboard (hoặc trang bạn muốn)
    }
  }, [navigate]);

  return (
    <div>
      <button onClick={initiateGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default LoginGoogle;
