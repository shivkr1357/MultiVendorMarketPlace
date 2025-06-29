import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.tax = action.payload.tax;
      state.shipping = action.payload.shipping;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
      } else {
        state.items.push(action.payload);
      }
      cartSlice.caseReducers.updateTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      cartSlice.caseReducers.updateTotals(state);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item._id === action.payload.itemId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.total = item.price * item.quantity;
      }
      cartSlice.caseReducers.updateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.itemCount = 0;
    },
    updateTotals: (state) => {
      state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0);
      state.tax = state.subtotal * 0.1; // 10% tax
      state.shipping = state.subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
      state.total = state.subtotal + state.tax + state.shipping;
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
  },
});

export const { setCart, addItem, removeItem, updateItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
