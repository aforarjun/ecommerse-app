import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers/userSlice';
import wishlistSlice from './reducers/wishlistSlice';
import cartSlice from './reducers/cartSlice';
import productsSlice from './reducers/productsSlice';
import eventsSlice from './reducers/eventsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productsSlice,
    wishlist: wishlistSlice,
    cart: cartSlice,
    events: eventsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
