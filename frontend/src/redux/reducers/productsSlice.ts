import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product, User } from '../../utils/Interfaces';
import { axiosInstance } from '../../server';

interface InitialState {
  isLoading: boolean;
  allProducts: Product[];
  products: Product[];
  product: Product | null;
  success: boolean;
  error: String;
}

const initialState: InitialState = {
  isLoading: false,
  allProducts: [],
  products: [],
  product: null,
  success: false,
  error: ''
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Clear Errors and Messages
    clearErrors: (state) => {
      state.error = '';
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    // create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.products = [payload.product, ...state.products];
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // get product details
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.product = payload.product;
      })
      .addCase(getProductDetails.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // get all products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.allProducts = payload.products;
      })
      .addCase(getAllProducts.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // get all Seller products
    builder
      .addCase(getSellerProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerProducts.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.products = payload.products;
      })
      .addCase(getSellerProducts.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.products = state.products.map((product: any) => {
          if (product._id === payload.product._id) {
            return payload.product;
          }

          return product;
        });

        state.allProducts = state.allProducts.map((product: any) => {
          if (product._id === payload.product._id) {
            return payload.product;
          }

          return product;
        });
      })
      .addCase(updateProduct.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }: any) => {
        state.isLoading = false;
        state.products = state.products.filter((product: any) => {
          if (product._id !== payload.productId) {
            return product;
          }
        });

        state.allProducts = state.allProducts.filter((product: any) => {
          if (product._id !== payload.productId) {
            return product;
          }
        });
      })
      .addCase(deleteProduct.rejected, (state, { payload }: any) => {
        state.isLoading = false;
        state.error = payload.data.message;
      });

    // create review product
    // builder
    //   .addCase(productReview.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(productReview.fulfilled, (state, { payload }: any) => {
    //     state.isLoading = false;
    //     state.products = state.products.map((product: any) => {
    //       if (product._id !== payload.productId) {
    //         return product;
    //       }
    //     });

    //     state.allProducts = state.allProducts.map((product: any) => {
    //       if (product._id !== payload.productId) {
    //         return product;
    //       }
    //     });
    //   })
    //   .addCase(productReview.rejected, (state, { payload }: any) => {
    //     state.isLoading = false;
    //     state.error = payload.message;
    //   });
  }
});

export const { clearErrors } = productsSlice.actions;
export default productsSlice.reducer;

// Create Product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (body: Product, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/product/create-product', body, {
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

//  Get product details
export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/product/get-product/${id}`);

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all products
export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/product/get-all-products`);

      return data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

//  Get all Seller products
export const getSellerProducts = createAsyncThunk(
  'products/getSellerProducts',
  async (sellerId: String, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/product/get-seller-products/${sellerId}`, {
        withCredentials: true
      });

      return data;
    } catch (error: any) {
      console.log('seller products', error.response.data);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/product/update-product/${id}`, {
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

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/product/delete-product/${id}`, {
        withCredentials: true
      });
      console.log(data);
      return data;
    } catch (error: any) {
      console.log('delete product', error.response.data);
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  }
);

// Create a new Review
export const productReview = createAsyncThunk(
  'products/productReview',
  async (
    body: { user: User; rating: number; comment: string; productId: string; orderId: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.put(`/product/delete-product`, body, {
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
