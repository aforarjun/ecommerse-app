import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../utils/Interfaces';
import { axiosInstance } from '../../server';

interface UserInterface {
  isAuthenticated: boolean;
  user: User | null;
  isUserLoaded: boolean;
  isLoading: boolean;
  error: string;
  addressloading: boolean;
  successMessage: string;
  usersLoading: boolean;
  users: User[];
}

const initialState: UserInterface = {
  isAuthenticated: false,
  user: null,
  isUserLoaded: true,
  isLoading: false,
  error: '',
  addressloading: false,
  successMessage: '',
  usersLoading: false,
  users: []
};

const userSlice = createSlice({
  name: 'user',
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
    // Register request
    builder
      .addCase(registerRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerRequest.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.successMessage = payload.message;
      })
      .addCase(registerRequest.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // activate user / register user
    builder
      .addCase(activateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activateUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(activateUser.rejected, (state, { payload }: any) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = payload.user.isVerified;
        state.isLoading = false;
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(loginUser.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
        state.isAuthenticated = false;
      });

    // logout user
    builder
      .addCase(logoutUser.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, { payload }: any) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.successMessage = payload.message;
      })
      .addCase(logoutUser.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // load user
    builder
      .addCase(loadUser.pending, (state, { payload }) => {
        state.isLoading = true;
        state.isUserLoaded = true;
      })
      .addCase(loadUser.fulfilled, (state, { payload }: any) => {
        state.isAuthenticated = true;
        state.user = payload.user;
        state.successMessage = payload.message;
        state.isLoading = false;
        state.isUserLoaded = false;
      })
      .addCase(loadUser.rejected, (state, { payload }: any) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isUserLoaded = false;
        state.error = payload?.data?.message || '';
      });

    // Update user
    builder
      .addCase(updateUser.fulfilled, (state, { payload }: any) => {
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(updateUser.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload?.data?.message || '';
      });

    // Update user Avatar
    builder
      .addCase(updateUserAvatar.fulfilled, (state, { payload }: any) => {
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(updateUserAvatar.rejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || '';
      });

    // Update user Avatar
    builder
      .addCase(updateUserAddress.fulfilled, (state, { payload }: any) => {
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(updateUserAddress.rejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || '';
      });

    // Update user Avatar
    builder
      .addCase(deleteUserAddress.fulfilled, (state, { payload }: any) => {
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(deleteUserAddress.rejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || '';
      });
  }
});

export const { clearErrors, clearMessages } = userSlice.actions;
export default userSlice.reducer;

// ************************ Thunk *****************************
// send request for register
export const registerRequest = createAsyncThunk(
  'user/registerRequest',
  async (body: any, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post('/user/create-user', body, { withCredentials: true });

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// 1. activate user / register
export const activateUser = createAsyncThunk(
  'user/activate',
  async (tokenData: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/user/activate-user', tokenData, {
        withCredentials: true
      });
      return data;
    } catch (error: any) {
      console.log(error.response.data);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// 2. Login user
export const loginUser = createAsyncThunk(
  'user/login',
  async (body: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/user/login-user', body, {
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

// 3. logout user
export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/user/logout-user');

    return data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response);
  }
});

// 4. load user
export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/user/load-user', { withCredentials: true });
    return data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response);
  }
});

// 5. Update user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (body: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('/user/update-user', body, {
        withCredentials: true
      });
      console.log('data', data);
      return data;
    } catch (error: any) {
      console.log(error.response.data);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// 6. update user Profile Avatar
export const updateUserAvatar = createAsyncThunk(
  'user/updateUserAvatar',
  async (body: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('/user/update-avatar', body, {
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

// 7. update User Addresses
export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async (body: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('/user/update-user-addresses', body, {
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

// 7. delete User Address
export const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async (addressId: any, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/user/delete-user-address/${addressId}`, {
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
