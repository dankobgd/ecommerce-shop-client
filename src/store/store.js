import { configureStore } from '@reduxjs/toolkit';

import productsSlice from './products/productsSlice';
import toastsSlice from './toasts/toastsSlice';
import uiReducer from './ui';
import userSlice from './user/userSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    toasts: toastsSlice.reducer,
    user: userSlice.reducer,
    products: productsSlice.reducer,
  },
});

export default store;
