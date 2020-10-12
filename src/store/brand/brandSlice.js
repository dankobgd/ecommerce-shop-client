import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'brands';

export const brandCreate = createAsyncThunk(`${sliceName}/create`, async (formData, { dispatch, rejectWithValue }) => {
  try {
    const brand = await api.brands.create(formData);
    dispatch(toastSlice.actions.addToast(successToast('Brand created')));
    return brand;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandUpdate = createAsyncThunk(
  `${sliceName}/update`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const brand = await api.brands.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Brand details updated')));
      return brand;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const brandGetAll = createAsyncThunk(`${sliceName}/getAll`, async (params, { rejectWithValue }) => {
  try {
    const brands = await api.brands.getAll(params);
    return brands;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandGet = createAsyncThunk(`${sliceName}/get`, async (id, { rejectWithValue }) => {
  try {
    const brand = await api.brands.get(id);
    return brand;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandDelete = createAsyncThunk(`${sliceName}/delete`, async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.brands.delete(id);
    dispatch(toastSlice.actions.addToast(successToast('Brand deleted')));
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandAdapter = createEntityAdapter();

const initialState = brandAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const brandSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
    setPaginationMeta: (state, { payload }) => {
      state.pagination = payload;
    },
  },
  extraReducers: {
    [brandCreate.fulfilled]: brandAdapter.addOne,
    [brandGet.fulfilled]: brandAdapter.upsertOne,
    [brandGetAll.fulfilled]: (state, { payload }) => {
      brandAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [brandUpdate.fulfilled]: brandAdapter.upsertOne,
    [brandDelete.fulfilled]: brandAdapter.removeOne,
  },
});

export const {
  selectById: selectBrandById,
  selectAll: selectAllBrands,
  selectEntities: selectBrandEntities,
  selectIds: selectBrandIds,
  selectTotal: selectBrandTotal,
} = brandAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectCurrentEditBrand = createSelector(
  [selectBrandEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export const selectCurrentProductBrand = createSelector(
  [state => state.products.entities[state.products.currentId]?.brand, selectBrandEntities],
  (id, entities) => entities[id]
);

export default brandSlice;
