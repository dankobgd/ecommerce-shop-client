import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'category';

export const categoryCreate = createAsyncThunk(
  `${sliceName}/categoryCreate`,
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const category = await api.categories.create(formData);
      dispatch(toastSlice.actions.addToast(successToast('Category created')));
      return category;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const categoryUpdate = createAsyncThunk(
  `${sliceName}/categoryUpdate`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const category = await api.categories.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Category details updated')));
      return category;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const categoryGetAll = createAsyncThunk(`${sliceName}/categoryGetAll`, async (_, { rejectWithValue }) => {
  try {
    const categories = await api.categories.getAll();
    return categories;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const categoryGet = createAsyncThunk(`${sliceName}/categoryGet`, async (id, { rejectWithValue }) => {
  try {
    const category = await api.categories.get(id);
    return category;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const categoryDelete = createAsyncThunk(
  `${sliceName}/categoryDelete`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.categories.delete(id);
      dispatch(toastSlice.actions.addToast(successToast('Category deleted')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const categorySlice = createSlice({
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
    [categoryCreate.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [categoryGet.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [categoryGetAll.fulfilled]: (state, { payload }) => {
      state.list = payload;
    },
    [categoryUpdate.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(c => c.id === payload.id);
      state.list[idx] = payload;
    },
    [categoryDelete.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(x => x === payload);
      state.list.splice(idx, 1);
    },
  },
});

export const selectAllCategories = state => state.category.list;
export const selectCategoryById = id => state => state.category.list.find(c => c.id === id);
export const selectSelectedId = state => state.category.selectedId;

export default categorySlice;
