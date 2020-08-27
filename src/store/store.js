import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localStorageEngine from 'redux-persist/lib/storage';

import brandSlice from './brand/brandSlice';
import categorySlice from './category/categorySlice';
import productSlice from './product/productSlice';
import tagSlice from './tag/tagSlice';
import toastSlice from './toast/toastSlice';
import uiReducer from './ui';
import userSlice from './user/userSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
  toasts: toastSlice.reducer,
  user: userSlice.reducer,
  product: productSlice.reducer,
  brand: brandSlice.reducer,
  category: categorySlice.reducer,
  tag: tagSlice.reducer,
});

const persistConfig = {
  key: 'ecommerce/root',
  storage: localStorageEngine,
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
