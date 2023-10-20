import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../../utils/Interfaces';

interface InitialState {
  wishlist: Product[];
}

const initialState: InitialState = {
  wishlist: localStorage.getItem('wishlistItems')?.length
    ? JSON.parse(localStorage.getItem('wishlistItems')!)
    : []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, { payload }: { payload: Product }) => {
      state.wishlist = [payload, ...state.wishlist];
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
    },

    removeFromWishlist: (state, { payload }: { payload: string }) => {
      state.wishlist = state.wishlist.filter((item) => item._id !== payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
    }
  }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
