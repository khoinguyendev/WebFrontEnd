import { Link } from "react-router-dom";
import Bread from "../../components/client/Bread";

const Register = () => {
  return (
    <div className="py-4">
      <div className="custom-container">
        <Bread title="Đăng ký" />
        <div className="grid grid-cols-12">
          <div className="col-span-2"></div>
          <div className="col-span-8 grid grid-cols-12">
            <div className="col-span-7 p-6 border border-primary text-gray1">
              <h3 className="font-bold  text-base ">Đăng ký tài khoản</h3>
              <div className="my-2">
                <label className="font-bold text-sm">Tên</label>
                <input type="text" placeholder="Email" className="w-full my-2 px-2 py-2 border border-gray3 rounded text-ms outline-none text-gray1" />
              </div>
              <div className="my-2">
                <label className="font-bold text-sm">Số điện thoại</label>
                <input type="text" placeholder="Email" className="w-full my-2 px-2 py-2 border border-gray3 rounded text-ms outline-none text-gray1" />
              </div>
              <div className="my-2">
                <label className="font-bold text-sm">Email</label>
                <input type="text" placeholder="Email" className="w-full my-2 px-2 py-2 border border-gray3 rounded text-ms outline-none text-gray1" />
              </div>
              <div className="my-2">
                <label className="font-bold text-sm">Mật khẩu</label>
                <input type="password" placeholder="Email" className="w-full my-2 px-2 py-2 border border-gray3 rounded text-ms outline-none text-gray1" />
              </div>
              <div className="mt-5 flex">
                <button className="flex-1 bg-primary text-white py-2 px-4 rounded font-bold">Đăng kí</button>
              </div>
            </div>
            <div className="col-span-5 bg-primary text-white p-6">
              <h3 className="font-bold">Quyền lợi thành viên</h3>
              <ul className="mt-6 flex flex-col text-sm gap-4">
                <li>Vận chuyển siêu tốc</li>
                <li>Sản phẩm đa dạng</li>
                <li>Đổi trả dễ dàng</li>
                <li>Tích điểm đổi quà</li>
                <li>Được giảm giá cho lần mua tiếp theo lên đến 10%</li>
              </ul>
              <div className="mt-5 text-center">
                <Link to={"/dang-nhap"} className="border border-white rounded py-2 px-8">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
