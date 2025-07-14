import { useDispatch, useSelector } from "react-redux";
import SildeProduct from "./SildeProduct";
import { RootState } from "../../redux/store";
import { clearViewted } from "../../redux/productViewtedSlice";

const ViewedProduct = () => {
  const { items } = useSelector((state: RootState) => state.product);
  const dispatch=useDispatch();
  return (


    items.length > 0 && (
      <div>
        <h2 className="border-b-primary border-b-4  flex justify-between">
          <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">Sản phẩm đã xem</button>
          <button className="text-primary" onClick={()=>dispatch(clearViewted())}>Xóa</button>
        </h2>
        <div className="py-2">
          <div className="p-1 border border-primary rounded-lg">
            <SildeProduct products={items} />
          </div>
        </div>
      </div>

    )

  );
};

export default ViewedProduct;
