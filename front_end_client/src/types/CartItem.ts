import { IAttributeVariant } from "./AttributeVariant";

export type ICartItem = {
  id: number;
  variantId: number;
  name: string;
  image: string;
  quantity: number;
  totalPrice: number;
  sale: boolean;
  price: number;
  stockQuantity: number;
  priceSale: number | undefined;
  attributes: IAttributeVariant[];

};
