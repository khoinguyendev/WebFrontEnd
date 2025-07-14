import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "../../types/Product";
import { formatCurrency, urlList } from "../../util/Format";

const ItemProductSlide = ({ product, shadow = false }: { product: IProduct; shadow?: boolean }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const productVariant = product.variants.length > 1 ? product.variants[1] : product.variants[0];

  const handleBuyNow = () => {
    const selectedCartItems = {
      id: product.id,
      quantity: 1,
      variantId: productVariant.id,
      name: product.name,
      image: product.image,
      totalPrice: productVariant.sale ? (productVariant.priceSale ? productVariant.priceSale : 0) * 1 : productVariant.price * 1,
      sale: productVariant.sale,
      price: productVariant.price,
      priceSale: productVariant.priceSale,
      attributes: productVariant.attributes,
      stock: productVariant.stockQuantity
    };
    navigate('/thanh-toan', { state: { selectedCartItems: [selectedCartItems] } });
  }
  return (
    <Link to={`/san-pham/${product.id}`} className={`block relative bg-white w-full rounded p-2 ${shadow && "shadow-lg"} `} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="w-full h-[230px] p-3 mb-2 overflow-hidden">
        <img className={`scale-100 w-full h-full object-cover ${open && "scale-110"} duration-500`} src={urlList(product.image)} alt="Product" />
      </div>
      <div>
        <p className="font-bold text-[14px] leading-5 text-gray1 line-clamp-2 h-[40px]">{product.name}</p>
        <div className="flex items-end gap-2">
          <p className="text-price font-bold">{product.variants[0].sale ? formatCurrency(product.variants[0].priceSale) : formatCurrency(product.variants[0].price)}</p>
          {product.variants[0].sale && <p className="text-[#98a2b3] text-[14px] line-through">{formatCurrency(product.variants[0].price)}</p>}

        </div>
        <div className="flex items-center justify-center mt-2">
          {product.variants[0].stockQuantity > 0 ? (
            <button className="text-primary" onClick={(e) => {
              e.preventDefault();  // Ngăn không cho Link trigger
              e.stopPropagation(); // Ngăn sự kiện nổi lên Link
              handleBuyNow();      // Thực hiện hành động mua
            }}>Mua ngay</button>
          ) : (
            <p className="text-primary">Hết hàng</p>
          )}

        </div>

        {/* <div className="flex justify-end">
          <button className={`relative px-1 py-1 rounded-md`}>
            <span className={`absolute z-10 inset-0 bg-[#ff0000] scale-0 transition-transform duration-500 rounded-md ${open && "scale-100"}`} style={{ transformOrigin: "center" }}></span>
            <div className={`relative z-10 transition-colors duration-500 ${open ? "text-white" : "text-gray2"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="currentColor" className="size-6">
                <circle cx={7} cy={17} r={2} />
                <circle cx={15} cy={17} r={2} />
                <path
                  d="M20,4.4V5l-1.8,6.3c-0.1,0.4-0.5,0.7-1,0.7H6.7c-0.4,0-0.8-0.3-1-0.7L3.3,3.9C3.1,3.3,2.6,3,2.1,3H0.4C0.2,3,0,2.8,0,2.6
								 V1.4C0,1.2,0.2,1,0.4,1h2.5c1,0,1.8,0.6,2.1,1.6L5.1,3l2.3,6.8c0,0.1,0.2,0.2,0.3,0.2h8.6c0.1,0,0.3-0.1,0.3-0.2l1.3-4.4
								 C17.9,5.2,17.7,5,17.5,5H9.4C9.2,5,9,4.8,9,4.6V3.4C9,3.2,9.2,3,9.4,3h9.2C19.4,3,20,3.6,20,4.4z"
                />
              </svg>
            </div>
          </button>
        </div> */}
      </div>
      <div className={`absolute flex flex-col gap-2 top-[10px] right-[10px] scale-0 ${open && "scale-100"} duration-500`}>
        <button className={`relative px-1 py-1 rounded-md bg-primary`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
        {/* <button className={`relative px-1 py-1 rounded-md bg-primary`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
          </svg>
        </button> */}
      </div>
    </Link>
  );
};

export default ItemProductSlide;
