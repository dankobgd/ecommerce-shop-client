import { configureStore } from '@reduxjs/toolkit';

import toastsSlice from './toasts/toastsSlice';
import userSlice from './user/userSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    toasts: toastsSlice.reducer,
  },
});

export default store;
