import { formatCurrency, urlList } from "../../../util/Format";
import { ICartItem } from "../../../types/CartItem";

const ItemPayment = ({
    cart,

}: {
    cart: ICartItem;

}) => {

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <td className="px-6 py-4">
                <div className="flex gap-2 items-center">
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
                </div>
            </td>
            <td className="px-6 py-4">
                {cart.sale ? formatCurrency(cart.priceSale) : formatCurrency(cart.price)}
            </td>
            <td className="px-6 py-4">
                <input value={cart.quantity} readOnly className="w-12 text-center border border-gray-300" />
            </td>
            <td className="px-6 py-4">
                {formatCurrency(cart.totalPrice)}
            </td>
        </tr>

    );
};
export default ItemPayment;