import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: { allProducts: [], isLoading: false },
  reducers: {}
});

export default productsSlice.reducer;
