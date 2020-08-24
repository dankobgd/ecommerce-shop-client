import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'product';

export const productCreate = createAsyncThunk(
  `${sliceName}/productCreate`,
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const product = await api.products.create(formData);
      dispatch(toastSlice.actions.addToast(successToast('Product created')));
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

export const selectAllProducts = state => state.product.list;

export default productsSlice;
