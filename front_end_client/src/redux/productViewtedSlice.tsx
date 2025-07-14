import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../types/Product";

export interface ProductViewted extends IProduct {}

interface ProductState {
  items: ProductViewted[];
}

// 👉 Hàm load cart từ localStorage (Hàm thuần túy)
const loadCartFromStorage = (): ProductViewted[] => {
  const cart = localStorage.getItem("productviewted");
  return cart ? JSON.parse(cart) : [];
};

const initialState: ProductState = {
  items: loadCartFromStorage(),
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToViewed: (state, action: PayloadAction<IProduct>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (!existingItem) {
        state.items = [product, ...state.items];
        localStorage.setItem("productviewted", JSON.stringify(state.items));
      }
    },
    removeFromViewted: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("productviewted", JSON.stringify(state.items));
    },
    clearViewted: (state) => {
      state.items = [];
      localStorage.removeItem("productviewted");
    },
    // 👉 Thêm action này để khởi tạo giỏ hàng từ localStorage
    initializeViewted: (state) => {
      state.items = loadCartFromStorage();
    },
  },
});

export const { addToViewed, removeFromViewted, initializeViewted,clearViewted } = productSlice.actions;
export default productSlice.reducer;
