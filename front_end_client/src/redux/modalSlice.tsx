// src/redux/slices/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  isLogin: boolean; // true: login modal, false: register modal
}

const initialState: ModalState = {
  isOpen: false,
  isLogin: true,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ isLogin: boolean }>) => {
      state.isOpen = true;
      state.isLogin = action.payload.isLogin;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    toggleAuthMode: (state) => {
      state.isLogin = !state.isLogin;
    },
  },
});

export const { openModal, closeModal, toggleAuthMode } = modalSlice.actions;
export default modalSlice.reducer;
