import {  useState } from "react";
import { IProduct } from "../../types/Product";
import { formatCurrency } from "../../util/Format";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { IProductVariant } from "../../types/ProductVariant";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { openModal } from "../../redux/modalSlice";

const ProductInfo = ({ product }: { product: IProduct | null }) => {
  if (!product) return null;
        const cartItems = useSelector((state: RootState) => state.cart.items);

  const user = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [productVariant, setProductVariant] = useState<IProductVariant>(product.variants.length > 1 ? product.variants[1] : product.variants[0]);
  const option: boolean = product.variants.length > 1 ? true : false;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => (prev < productVariant.stockQuantity ? prev + 1 : prev));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > productVariant.stockQuantity) {
      value = productVariant.stockQuantity;
    }
    setQuantity(value);
  };

  const handleAddToCart = async (variantId: number | null) => {
    const cartItem = {
      id: product.id,
      quantity: quantity,
      variantId: productVariant.id,
      name: product.name,
      image: product.image,
      totalPrice: productVariant.sale ? (productVariant.priceSale ? productVariant.priceSale : 0) * quantity : productVariant.price * quantity,
      sale: productVariant.sale,
      price: productVariant.price,
      priceSale: productVariant.priceSale,
      stockQuantity: productVariant.stockQuantity,
      attributes: productVariant.attributes,
    };
    const existingItem = cartItems.find(item => item.variantId === productVariant.id);
    if (existingItem) {
      if (existingItem.stockQuantity < existingItem.quantity + quantity) {
        toast.error("Số lượng vượt quá số lượng trong kho");
        return;
      }
    }
    dispatch(addToCart(cartItem));
    toast.success("Đã thêm vào giỏ hàng");
  };
 const handlePayment = () => {
    // if (user) {
      const selectedCartItems = {
      id: product.id,
      quantity: quantity,
      variantId: productVariant.id,
      name: product.name,
      image: product.image,
      totalPrice: productVariant.sale ? (productVariant.priceSale ? productVariant.priceSale : 0) * quantity : productVariant.price * quantity,
      sale: productVariant.sale,
      price: productVariant.price,
      priceSale: productVariant.priceSale,
      attributes: productVariant.attributes,
      stock:productVariant.stockQuantity
    };
     

      navigate('/thanh-toan', { state: { selectedCartItems:[selectedCartItems] } });
    // } else {
    //   toast.error("Vui lòng đăng nhập để thanh toán");
    //   dispatch(openModal({ isLogin: true }));
    // }
  };
  
  return (
    <div className="text-gray1">
      <h4 className="font-bold text-lg text-gray1">{product?.name}</h4>
      <p className="text-md my-3">
        Thương hiệu: <span className="font-bold">{product?.brand.name}</span>
      </p>
      <div>
        <span className="text-primary font-bold text-2xl">{formatCurrency(productVariant.sale ? productVariant.priceSale : productVariant.price)}</span>
        {productVariant.sale && <span className="text-sm ms-5 line-through">Giá gốc:{formatCurrency(productVariant.price)}</span>}
      </div>
      {productVariant.sale && (
        <div className="my-2">
          <p>
            <span className="text-green_btn text-sm">Tiết kiệm: </span>
            <span className="text-primary font-bold text-sm line-through">{formatCurrency(productVariant.price - (productVariant.priceSale ? productVariant.priceSale : 0))}</span>
          </p>
        </div>
      )}
      {option && (
        <>
          <div><p>Phiên bản</p></div>
          <div className="flex gap-2">
            {product.variants.map((variant: IProductVariant) => {
              if (variant.attributes.length === 0) return null;
              return (
                <button onClick={() => setProductVariant(variant)} key={variant.id} className={`flex items-center p-3 border ${productVariant.id === variant.id ? 'border-blue-500' : 'border-gray-200'} rounded`}>
                  {variant.attributes.map((attr, index) => (
                    <span key={index} className="text-gray-500 text-theme-sm dark:text-gray-400 text-sm">
                      {attr.attribute.name}: <span className="text-blue-500">{attr.attributeValue.value}</span>
                      {index < variant.attributes.length - 1 && ", "}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </>
      )}
      {productVariant.stockQuantity == 0 ?
        <p className="font-bold">Sản phẩm hiện đang hết hàng</p>
        :
        <>
          <div className="flex items-center mt-3">
            <button className="text-white bg-primary h-8 w-8 flex items-center justify-center text-lg" onClick={handleDecrease}>
              -
            </button>
            <input type="number" value={quantity} onChange={handleChange} className="border font-bold h-8 w-16 text-center" />
            <button className="text-white bg-primary h-8 w-8 flex items-center justify-center text-lg" onClick={handleIncrease}>
              +
            </button>
            <span className="ms-3 text-sm font-bold">Còn lại:{productVariant.stockQuantity}</span>
          </div>
          <div className="flex gap-3 my-3">
            <button  onClick={() => handleAddToCart(null)} className="bg-primary text-white px-5 py-2 rounded-md">
              Thêm vào giỏ hàng
            </button>

            <button onClick={handlePayment} className="bg-green_btn text-white px-5 py-2 rounded-md">Mua ngay</button>
          </div>
        </>
      }
    </div>
  );
};

export default ProductInfo;
