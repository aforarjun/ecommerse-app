import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Seller } from '../../utils/Interfaces';
import { axiosInstance } from '../../server';

interface SellerInterface {
  isSeller: boolean;
  seller: Seller | null;
  isLoading: boolean;
  error: string;
  successMessage: string;
}

const initialState: SellerInterface = {
  isSeller: false,
  seller: null,
  isLoading: true,
  error: '',
  successMessage: ''
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    // Clear Errors and Messages
    clearErrors: (state) => {
      state.error = '';
    },
    clearMessages: (state) => {
      state.successMessage = '';
    }
  },
  extraReducers: (builder) => {
    // Register Seller request
    builder
      .addCase(registerRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerRequest.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.isSeller = payload.seller?.isVerified;
        state.seller = payload.seller;
        state.successMessage = payload.message;
      })
      .addCase(registerRequest.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // Verify Seller
    builder
      .addCase(verifySeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifySeller.fulfilled, (state, { payload }: any) => {
        state.isSeller = payload.seller?.isVerified;
        state.isLoading = false;
      })
      .addCase(verifySeller.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // Login Seller
    builder
      .addCase(loginSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSeller.fulfilled, (state, { payload }: any) => {
        state.isSeller = payload.seller.isVerified;
        state.isLoading = false;
        state.seller = payload.seller;
        state.successMessage = payload.message;
      })
      .addCase(loginSeller.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // Logout Seller
    builder
      .addCase(logoutSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutSeller.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.isSeller = false;
        state.seller = null;
        state.successMessage = payload.message;
      })
      .addCase(logoutSeller.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Something went wrong, Try again';
      });

    // load Seller
    builder
      .addCase(loadSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadSeller.fulfilled, (state, { payload }: any) => {
        state.isSeller = payload.seller.isVerified;
        state.seller = payload.seller;
        state.successMessage = payload.message;
        state.isLoading = false;
      })
      .addCase(loadSeller.rejected, (state, { payload }: any) => {
        state.isSeller = false;
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // Get seller info
    builder
      .addCase(getSellerInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerInfo.fulfilled, (state, { payload }: any) => {
        state.seller = payload.seller;
        state.successMessage = payload.message;
        state.isLoading = false;
      })
      .addCase(getSellerInfo.rejected, (state, { payload }: any) => {
        state.isSeller = false;
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // update seller info
    builder.addCase(updateSellerInfo.fulfilled, (state, { payload }: any) => {
      state.seller = payload.seller;
      state.successMessage = payload.message;
    });

    // Update seller Avatar
    builder
      .addCase(updateSellerAvatar.fulfilled, (state, { payload }: any) => {
        state.seller = payload.seller;
        state.successMessage = payload.message;
      })
      .addCase(updateSellerAvatar.rejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || '';
      });
  }
});

export default sellerSlice.reducer;

// Register seller
export const registerRequest = createAsyncThunk(
  'seller/registerRequest',
  async (body: any, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post('/seller/create-seller', body, {
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

// Verify Seller
export const verifySeller = createAsyncThunk(
  'seller/verifySeller',
  async (tokenData: any, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post('/seller/verify-seller', tokenData, {
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

// Login Seller
export const loginSeller = createAsyncThunk(
  'seller/loginSeller',
  async (body: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/seller/login-seller', body, {
        withCredentials: true
      });
      return data;
    } catch (error: any) {
      console.log(error);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Load Seller
export const loadSeller = createAsyncThunk('seller/loadSeller', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/seller/load-seller', { withCredentials: true });
    return data;
  } catch (error: any) {
    console.log('load seller', error.response.data);
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response);
  }
});

// 3. logout Seller
export const logoutSeller = createAsyncThunk(
  'seller/logoutSeller',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/seller/logout-seller', { withCredentials: true });

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Get seller Info
export const getSellerInfo = createAsyncThunk(
  'seller/getSellerInfo',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/seller/get-seller/${id}`, {
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

// Update seller Info
export const updateSellerInfo = createAsyncThunk(
  'seller/updateSellerInfo',
  async (body: Seller, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/seller/update-seller/${body._id}`, body, {
        withCredentials: true
      });
      return data;
    } catch (error: any) {
      console.log('error seller update', error);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Update seller avatar
export const updateSellerAvatar = createAsyncThunk(
  'seller/updateSellerAvagtar',
  async (body: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('/seller/update-seller-avatar', body, {
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
