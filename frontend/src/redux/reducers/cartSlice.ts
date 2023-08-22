import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: [] },
  reducers: {}
});

export default cartSlice.reducer;
