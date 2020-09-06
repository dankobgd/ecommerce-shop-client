import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

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

export const productGetAll = createAsyncThunk(`${sliceName}/productGetAll`, async (params, { rejectWithValue }) => {
  try {
    const products = await api.products.getAll(params);
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
      return id;
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

export const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const productSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [productCreate.fulfilled]: productAdapter.addOne,
    [productGet.fulfilled]: productAdapter.upsertOne,
    [productGetAll.fulfilled]: (state, { payload }) => {
      productAdapter.setAll(state, payload.data);
      state.pagination = payload.meta;
    },
    [productUpdate.fulfilled]: productAdapter.upsertOne,
    [productDelete.fulfilled]: productAdapter.removeOne,
    [productGetTags.fulfilled]: (state, { payload }) => {
      const idx = payload[0].productId;
      const tagIds = payload.map(x => x.id);
      state.entities[idx].tags = tagIds;
    },
  },
});

export const {
  selectById: selectProductById,
  selectAll: selectAllProducts,
  selectEntities: selectProductEntities,
  selectIds: selectProductIds,
  selectTotal: selectProductTotal,
} = productAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectCurrentProduct = createSelector(
  [selectProductEntities, selectEditId],
  (entities, currentId) => entities[currentId]
);

export default productSlice;
