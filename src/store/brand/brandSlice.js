import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'brand';

export const brandCreate = createAsyncThunk(
  `${sliceName}/brandCreate`,
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const brand = await api.brands.create(formData);
      dispatch(toastSlice.actions.addToast(successToast('Brand created')));
      return brand;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const brandUpdate = createAsyncThunk(
  `${sliceName}/brandUpdate`,
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

export const brandGetAll = createAsyncThunk(`${sliceName}/brandGetAll`, async (_, { rejectWithValue }) => {
  try {
    const brands = await api.brands.getAll();
    return brands;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandGet = createAsyncThunk(`${sliceName}/brandGet`, async (id, { rejectWithValue }) => {
  try {
    const brand = await api.brands.get(id);
    return brand;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandDelete = createAsyncThunk(`${sliceName}/brandDelete`, async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.brands.delete(id);
    dispatch(toastSlice.actions.addToast(successToast('Brand deleted')));
  } catch (error) {
    return rejectWithValue(error);
  }
});

const brandSlice = createSlice({
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
    [brandCreate.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [brandGet.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [brandGetAll.fulfilled]: (state, { payload }) => {
      state.list = payload;
    },
    [brandUpdate.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(b => b.id === payload.id);
      state.list[idx] = payload;
    },
    [brandDelete.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(x => x === payload);
      state.list.splice(idx, 1);
    },
  },
});

export const selectAllBrands = state => state.brand.list;
export const selectSelectedId = state => state.brand.selectedId;

export const selectCurrentBrand = createSelector([selectAllBrands, selectSelectedId], (items, currentId) =>
  items.find(x => x.id === currentId)
);

export default brandSlice;
