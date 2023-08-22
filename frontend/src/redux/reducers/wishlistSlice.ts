import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { wishlist: [] },
  reducers: {}
});

export default wishlistSlice.reducer;
