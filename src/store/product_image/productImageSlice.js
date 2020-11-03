import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import productSlice from '../product/productSlice';

export const sliceName = 'product_images';

export const imageGetAllForProduct = createAsyncThunk(
  `${sliceName}/getAllForProduct`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const images = await api.products.getImages(id);
      dispatch(productSlice.actions.setImageIds(images));
      return images;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productImageAdapter = createEntityAdapter();

const initialState = productImageAdapter.getInitialState({
  editId: null,
});

const productImagesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [imageGetAllForProduct.fulfilled]: (state, { payload }) => {
      productImageAdapter.upsertMany(state, payload);
    },
  },
});

export const {
  selectById: selectProductImageById,
  selectAll: selectAllProductImages,
  selectEntities: selectProductImageEntities,
  selectIds: selectProductImageIds,
  selectTotal: selectProductImageTotal,
} = productImageAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;

export const selectCurrentProductImages = createSelector(
  [state => state[productSlice.name].entities[state.products.currentId]?.images, selectProductImageEntities],
  (ids, entities) => (ids ? ids.map(id => entities[id]) : [])
);

export default productImagesSlice;
