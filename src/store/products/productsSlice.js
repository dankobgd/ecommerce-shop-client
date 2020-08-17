import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';
import toastsSlice, { successToast } from '../toasts/toastsSlice';

export const sliceName = 'products';

export const productCreate = createAsyncThunk(
  `${sliceName}/productCreate`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      const product = await api.products.create(details);
      dispatch(toastsSlice.actions.addToast(successToast('Product created')));
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productsSlice = createSlice({
  name: sliceName,
  initialState: {
    list: [],
  },
  reducers: {},
  extraReducers: {
    [productCreate.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
  },
});

export const selectAllProducts = state => state.products.list;

export default productsSlice;
