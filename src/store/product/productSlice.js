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

export const productUpdate = createAsyncThunk(
  `${sliceName}/productUpdate`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const product = await api.products.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Product details updated')));
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productGetAll = createAsyncThunk(`${sliceName}/productGetAll`, async (_, { rejectWithValue }) => {
  try {
    const products = await api.products.getAll();
    return products;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGet = createAsyncThunk(`${sliceName}/productGet`, async (id, { rejectWithValue }) => {
  try {
    const product = await api.products.get(id);
    return product;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productDelete = createAsyncThunk(
  `${sliceName}/productDelete`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.products.delete(id);
      dispatch(toastSlice.actions.addToast(successToast('Product deleted')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productGetTags = createAsyncThunk(`${sliceName}/productGetTags`, async (id, { rejectWithValue }) => {
  try {
    const tags = await api.products.getTags(id);
    return tags;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGetImages = createAsyncThunk(`${sliceName}/productGetImages`, async (id, { rejectWithValue }) => {
  try {
    const images = await api.products.getImages(id);
    return images;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const productsSlice = createSlice({
  name: sliceName,
  initialState: {
    list: [],
    selectedId: null,
  },
  reducers: {
    setSelectedId: (state, { payload }) => {
      state.selectedId = payload;
    },
  },
  extraReducers: {
    [productCreate.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [productGet.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [productGetAll.fulfilled]: (state, { payload }) => {
      state.list = payload;
    },
    [productUpdate.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(p => p.id === payload.id);
      state.list[idx] = payload;
    },
    [productDelete.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(x => x === payload);
      state.list.splice(idx, 1);
    },
  },
});

export const selectAllProducts = state => state.product.list;
export const selectProductById = id => state => state.product.list.find(p => p.id === id);
export const selectSelectedId = state => state.product.selectedId;

export default productsSlice;
