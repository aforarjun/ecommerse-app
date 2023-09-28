import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Event } from '../../utils/Interfaces';
import { axiosInstance } from '../../server';

interface InitialState {
  isLoading: boolean;
  allEvents: Event[];
  events: Event[];
  event: Event | null;
  success: boolean;
  error: String;
}

const initialState: InitialState = {
  isLoading: false,
  allEvents: [],
  events: [],
  event: null,
  success: false,
  error: ''
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Clear Errors and Messages
    clearErrors: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    // create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.events = [payload.event, ...state.events];
        state.success = true;
      })
      .addCase(createEvent.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message;
      });

    // get event details
    builder
      .addCase(getEventDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEventDetails.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.event = payload.event;
      })
      .addCase(getEventDetails.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // get all events
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.allEvents = payload.events;
      })
      .addCase(getAllEvents.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // get all Seller products
    builder
      .addCase(getSellerEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerEvents.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.events = payload.events;
      })
      .addCase(getSellerEvents.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // update product
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.events = state.events.map((event: any) => {
          if (event._id === payload.event._id) {
            return payload.event;
          }

          return event;
        });

        state.allEvents = state.allEvents.map((event: any) => {
          if (event._id === payload.event._id) {
            return payload.event;
          }

          return event;
        });
      })
      .addCase(updateEvent.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // delete product
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.events = state.events.filter((event: any) => {
          if (event._id !== payload.eventId) {
            return event;
          }
        });

        state.allEvents = state.allEvents.filter((event: any) => {
          if (event._id !== payload.eventId) {
            return event;
          }
        });
      })
      .addCase(deleteEvent.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });
  }
});

export const { clearErrors } = eventsSlice.actions;
export default eventsSlice.reducer;

// Create Event
export const createEvent = createAsyncThunk(
  'eventss/createEvent',
  async (body: Event, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/event/create-event', body, {
        withCredentials: true
      });

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get event details
export const getEventDetails = createAsyncThunk(
  'events/getEventDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/event/get-event/${id}`);

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all events
export const getAllEvents = createAsyncThunk(
  'events/getAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/event/get-all-events`);
      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all Seller events
export const getSellerEvents = createAsyncThunk(
  'events/getSellerEvents',
  async (sellerId: String, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/event/get-seller-events/${sellerId}`, {
        withCredentials: true
      });

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Update a event
export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/event/update-event/${id}`, {
        withCredentials: true
      });

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Delete a event
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/event/delete-event/${id}`, {
        withCredentials: true
      });
      console.log(data);
      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);
