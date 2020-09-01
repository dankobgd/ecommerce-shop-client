import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

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
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const categoryAdapter = createEntityAdapter();

const initialState = categoryAdapter.getInitialState({
  selectedId: null,
});

const categorySlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setSelectedId: (state, { payload }) => {
      state.selectedId = payload;
    },
  },
  extraReducers: {
    [categoryCreate.fulfilled]: categoryAdapter.addOne,
    [categoryGet.fulfilled]: categoryAdapter.upsertOne,
    [categoryGetAll.fulfilled]: categoryAdapter.setAll,
    [categoryUpdate.fulfilled]: categoryAdapter.upsertOne,
    [categoryDelete.fulfilled]: categoryAdapter.removeOne,
  },
});

export const {
  selectById: selectCategoryById,
  selectAll: selectAllCategories,
  selectEntities: selectCategoryEntities,
  selectIds: selectCategoryIds,
  selectTotal: selectCategoryTotal,
} = categoryAdapter.getSelectors(state => state[sliceName]);

export const selectSelectedId = state => state[sliceName].selectedId;

export const selectCurrentCategory = createSelector(
  [selectCategoryEntities, selectSelectedId],
  (entities, currentId) => entities[currentId]
);

export default categorySlice;
