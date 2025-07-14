import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { IProduct } from "../../types/Product";

const DescriptionProduct = ({ product }: { product: IProduct | null }) => {
  return (
    <div>
      <h4>
        <button className="bg-primary text-white px-5 py-2 font-bold">Mô tả</button>
      </h4>
      <div className="border border-gray3 m-h-[400px] w-full text-sm text-gray1 p-6">{product?.detail ? <FroalaEditorView model={product.detail} /> : <p>Không có mô tả</p>}</div>
    </div>
  );
};

export default DescriptionProduct;
