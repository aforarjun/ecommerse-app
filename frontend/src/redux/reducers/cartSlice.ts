import { createSlice } from '@reduxjs/toolkit';
import { Cart, Product } from '../../utils/Interfaces';

interface InitialState {
  cart: Cart[];
}

const initialState: InitialState = {
  cart: localStorage.getItem('cartItems')?.length
    ? JSON.parse(localStorage.getItem('cartItems')!)
    : []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }: { payload: Product }) => {
      const isItemExist = state.cart.find((item) => item.cartItem._id === payload._id);

      if (isItemExist) {
        isItemExist.qty += 1;

        state.cart.forEach((item) => {
          if (item.cartItem._id === payload._id) {
            item = isItemExist;
          }
        });
      } else {
        state.cart = [{ cartItem: payload, qty: 1 }, ...state.cart];
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cart));
    },

    removeFromCart: (state, { payload }: { payload: Product }) => {
      state.cart.forEach((item, index, object) => {
        if (item.cartItem._id === payload._id) {
          if (item.qty === 1) {
            object.splice(index, 1);
          } else {
            item.qty -= 1;
          }
        }
      });

      localStorage.setItem('cartItems', JSON.stringify(state.cart));
    },

    deleteFromCart: (state, { payload }: { payload: string }) => {
      state.cart = state.cart.filter(({ cartItem }) => cartItem._id !== payload);

      localStorage.setItem('cartItems', JSON.stringify(state.cart));
    }
  }
});

export const { addToCart, removeFromCart, deleteFromCart } = cartSlice.actions;
export default cartSlice.reducer;
