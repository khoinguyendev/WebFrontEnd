import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "../types/CartItem";

// Lấy cart từ localStorage nếu có
const storedCart = localStorage.getItem("cartItems");
const initialItems = storedCart ? JSON.parse(storedCart) : [];

interface CartState {
  items: ICartItem[];
}

const initialState: CartState = {
  items: initialItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const existingItem = state.items.find(
        (item) => item.variantId === action.payload.variantId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice += action.payload.totalPrice;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ variantId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.variantId === action.payload.variantId
      );

      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.sale
          ? (item.priceSale || item.price) * item.quantity
          : item.price * item.quantity;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.variantId !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
