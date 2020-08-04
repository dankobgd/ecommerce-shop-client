import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './ui';
import toastsSlice from './toasts/toastsSlice';
import userSlice from './user/userSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    toasts: toastsSlice.reducer,
    ui: uiReducer,
  },
});

export default store;
