import { useDispatch } from "react-redux";
import { ICartItem } from "../../types/CartItem";
import { formatCurrency, urlList } from "../../util/Format";
import Badge from "./badge/Badge";
import { removeFromCart } from "../../redux/cartSlice";

const ItemCart = ({
  cart,
  isSelected,
  onSelect,
  setCart,
}: {
  cart: ICartItem;
  isSelected: boolean;
  onSelect: () => void;
  setCart: (item: ICartItem, newQuantity: number) => void;
}) => {
    const dispatch = useDispatch();

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td className="px-6 py-4 flex gap-2">
        <img className="w-[80px] h-[80px] object-cover" src={urlList(cart.image)} />
        <div className="flex flex-col">
          <p className="text-gray1 font-bold">{cart.name}</p>
          {cart.attributes.map((attr, index) => (
            <span key={index} className="text-sm text-gray-500">
              {attr.attribute.name}: <span className="text-blue-500">{attr.attributeValue.value}</span>
              {index < cart.attributes.length - 1 && ', '}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        {cart.sale ? formatCurrency(cart.priceSale) : formatCurrency(cart.price)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setCart(cart, cart.quantity - 1)} className="bg-primary text-white w-6 h-6 flex justify-center items-center">-</button>
          <input value={cart.quantity} readOnly className="w-12 text-center border border-gray-300" />
          <button onClick={() => {
            if (cart.stockQuantity > cart.quantity) {
              setCart(cart, cart.quantity + 1);
            }
          }} className="bg-primary text-white w-6 h-6 flex justify-center items-center">+</button>
        </div>
        <div>Còn lại: {cart.stockQuantity}</div>
      </td>
      <td className="px-6 py-4">
        {formatCurrency(cart.totalPrice)}
      </td>
      <td>
        <button onClick={() => dispatch(removeFromCart(cart.variantId))} className="flex items-center gap-2">
          <Badge
            size="md"
            color={
              "error"
            }
          >Xóa</Badge>
        </button>
      </td>
    </tr>
  );
};
 export default ItemCart;