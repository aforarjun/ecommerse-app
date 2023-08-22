import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../utils/Interfaces';
import { axiosInstance } from '../../server';

interface UserInterface {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: null;
  addressloading: boolean;
  successMessage: string | null;
  usersLoading: boolean;
  users: User[];
}

const initialState: UserInterface = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  addressloading: false,
  successMessage: null,
  usersLoading: false,
  users: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear Errors and Messages
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Register request
    builder
      .addCase(registerRequest.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(registerRequest.fulfilled, (state, { payload }: any) => {
        state.isAuthenticated = payload.user.isVerified;
        state.isLoading = false;
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(registerRequest.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // activate user / register user
    builder
      .addCase(activateUser.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(activateUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = payload.user.isVerified;
        state.isLoading = false;
        state.user = payload.user;
        state.successMessage = payload.message;
      })
      .addCase(activateUser.rejected, (state, { payload }: any) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // login user
    builder
      .addCase(loginUser.pending, (state, { payload }) => {
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
        console.log(payload);
        state.error = payload.data.message;
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
        state.error = payload.data.message;
      });

    // load user
    builder
      .addCase(loadUser.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, { payload }: any) => {
        state.isAuthenticated = payload.user.isVerified;
        state.user = payload.user;
        state.successMessage = payload.message;
        state.isLoading = false;
      })
      .addCase(loadUser.rejected, (state, { payload }: any) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.user = null;
        state.successMessage = payload.message;
      })
      .addCase(updateUser.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
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
      const { data } = await axiosInstance.post('/user/verify-user', tokenData, {
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

// 2. Login user
export const loginUser = createAsyncThunk(
  'user/login',
  async (body: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/user/login-user', body, {
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

// 3. logout user
export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/user/logout-user');

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
    console.log(data);
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
  (
    body: {
      name: string;
      email: string;
      phoneNumber: number;
    },
    { rejectWithValue }
  ) =>
    async () => {
      try {
        const { data } = await axiosInstance.put('/user/update-user', body, {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Credentials': true
          }
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
