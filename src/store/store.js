import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import brandSlice from './brand/brandSlice';
import cartSlice from './cart/cartSlice';
import categorySlice from './category/categorySlice';
import orderSlice from './order/orderSlice';
import productSlice from './product/productSlice';
import productImageSlice from './product_image/productImageSlice';
import reviewSlice from './review/reviewSlice';
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
  [cartSlice.name]: cartSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [reviewSlice.name]: reviewSlice.reducer,
  [productImageSlice.name]: productImageSlice.reducer,
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
