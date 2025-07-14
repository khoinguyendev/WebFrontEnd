import { ICartItem } from "./CartItem";

export type ICart = {
  id: number;
  cartItems: ICartItem[];
};
