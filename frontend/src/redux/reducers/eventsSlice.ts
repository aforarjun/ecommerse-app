import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
  name: 'events',
  initialState: { allEvents: [], isLoading: false },
  reducers: {}
});

export default eventsSlice.reducer;
