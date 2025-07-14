import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function SignIn() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <PageMeta
        title="Đăng nhập"
        description="Đây là trang đăng nhập"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
