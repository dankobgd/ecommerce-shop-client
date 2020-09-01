import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

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
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const brandAdapter = createEntityAdapter();

const initialState = brandAdapter.getInitialState({
  selectedId: null,
});

const brandSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setSelectedId: (state, { payload }) => {
      state.selectedId = payload;
    },
  },
  extraReducers: {
    [brandCreate.fulfilled]: brandAdapter.addOne,
    [brandGet.fulfilled]: brandAdapter.upsertOne,
    [brandGetAll.fulfilled]: brandAdapter.setAll,
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

export const selectSelectedId = state => state[sliceName].selectedId;

export const selectCurrentBrand = createSelector(
  [selectBrandEntities, selectSelectedId],
  (entities, currentId) => entities[currentId]
);

export default brandSlice;
