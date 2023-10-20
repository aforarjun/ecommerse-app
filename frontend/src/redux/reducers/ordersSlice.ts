import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../server';
import { Order } from '../../utils/Interfaces';

interface InitialState {
  isLoading: boolean;
  allOrders: Order[];
  sellerOrders: Order[];
  userOrders: Order[];
  order: Order | null;
  success: boolean;
  error: String;
}

const initialState: InitialState = {
  isLoading: false,
  allOrders: [], // all orders
  sellerOrders: [], // all seller orders
  userOrders: [], // all user orders
  order: null,
  success: false,
  error: ''
};

const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Clear Errors and Messages
    clearErrors: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    // create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.allOrders = [payload.order, ...state.allOrders];
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message;
      });

    // get order details
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.order = payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // get all orders
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.allOrders = payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // get all Seller orders
    builder
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrders.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.sellerOrders = payload.orders;
      })
      .addCase(getSellerOrders.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // get all User orders
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.userOrders = payload.orders;
      })
      .addCase(getUserOrders.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // update order
    builder
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.sellerOrders = state.sellerOrders.map((order: any) => {
          if (order._id === payload.order._id) {
            return payload.order;
          }

          return order;
        });

        state.userOrders = state.userOrders.map((order: any) => {
          if (order._id === payload.order._id) {
            return payload.order;
          }

          return order;
        });

        state.allOrders = state.allOrders.map((order: any) => {
          if (order._id === payload.order._id) {
            return payload.order;
          }

          return order;
        });
      })
      .addCase(updateOrder.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // delete order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.sellerOrders = state.sellerOrders.filter((order: any) => {
          if (order._id === payload.orderId) {
            return false;
          }
          return true;
        });

        state.userOrders = state.userOrders.filter((order: any) => {
          if (order._id === payload.orderId) {
            return false;
          }
          return true;
        });

        state.allOrders = state.allOrders.filter((order: any) => {
          if (order._id === payload.orderId) {
            return false;
          }
          return true;
        });
      })
      .addCase(deleteOrder.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });
  }
});

export const { clearErrors } = ordersSlice.actions;
export default ordersSlice.reducer;

// Create Event
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (body: Event, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/order/create-order', body, {
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
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/order/get-order/${id}`);

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all orders
export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/order/get-all-orders`);
      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all Seller Orders
export const getSellerOrders = createAsyncThunk(
  'order/getSellerOrders',
  async (sellerId: String, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/order/get-seller-orders/${sellerId}`, {
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

//  Get all Seller Orders
export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (userId: String, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/order/get-user-orders/${userId}`, {
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

// Update a order status
export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/order/update-order/${id}`, {
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

// Delete a order
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/order/delete-order/${id}`, {
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
