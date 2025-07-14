import { useState } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../../types/Product";
import { formatCurrency, urlList } from "../../util/Format";
import { IProductVariant } from "../../types/ProductVariant";

const ItemSimilarProduct = ({ product }: { product: IProduct }) => {
  const [open, setOpen] = useState(false);
  const productVariant: IProductVariant = product.variants.length > 1 ? product.variants[1] : product.variants[0];

  return (
    <Link to={`/san-pham/${product.id}`} className="flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="w-[120px] h-[80px] my-2 overflow-hidden  flex justify-center">
        <img className={`scale-100 w-[80px] h-[80px] object-cover ${open && "scale-110"} duration-500`} src={urlList(product.image)} alt="Product" />
      </div>
      <div className="py-2 flex-1">
        <p className="text-[0.8rem] font-bold line-clamp-2 text-gray1">{product.name}</p>
        <p className="text-primary font-bold">{formatCurrency(productVariant.sale ? productVariant.priceSale : productVariant.price)}</p>
        {productVariant.sale && <span className="text-gray2  text-sm line-through">{formatCurrency(productVariant.price)}</span>}
      </div>
    </Link>
  );
};

export default ItemSimilarProduct;
