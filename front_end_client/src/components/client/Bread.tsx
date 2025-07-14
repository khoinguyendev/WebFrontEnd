import { Link } from "react-router-dom";

const Bread = ({ title }: { title: string }) => {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gray1">
        <Link to={"/"}>Trang chủ</Link>
      </span>
      <span className="text-gray1">/</span>
      <span className="text-[#ffb416]">{title}</span>
    </div>
  );
};

export default Bread;
