import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'cart',
  initialState: { isLoading: false, orders: [] },
  reducers: {}
});

export default ordersSlice.reducer;
