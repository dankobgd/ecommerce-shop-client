import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import brandSlice from './brand/brandSlice';
import categorySlice from './category/categorySlice';
import productSlice from './product/productSlice';
import tagSlice from './tag/tagSlice';
import toastSlice from './toast/toastSlice';
import uiReducer from './ui';
import userSlice from './user/userSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
  [toastSlice.name]: toastSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [productSlice.name]: productSlice.reducer,
  [brandSlice.name]: brandSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [tagSlice.name]: tagSlice.reducer,
});

const persistConfig = {
  key: 'ecommerce/root',
  storage,
  blacklist: ['ui', 'toasts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
