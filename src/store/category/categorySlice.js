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

export const categoryGetAll = createAsyncThunk(`${sliceName}/categoryGetAll`, async (params, { rejectWithValue }) => {
  try {
    const categories = await api.categories.getAll(params);
    return categories;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const categoryGetFeatured = createAsyncThunk(
  `${sliceName}/categoryGetFeatured`,
  async (params, { rejectWithValue }) => {
    try {
      const featured = await api.categories.getFeatured(params);
      return featured;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
  editId: null,
  pagination: null,
});

const categorySlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [categoryCreate.fulfilled]: categoryAdapter.addOne,
    [categoryGet.fulfilled]: categoryAdapter.upsertOne,
    [categoryGetAll.fulfilled]: (state, { payload }) => {
      categoryAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [categoryGetFeatured.fulfilled]: (state, { payload }) => {
      categoryAdapter.upsertMany(state, payload.data);
    },
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

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectFeaturedCategories = createSelector(selectAllCategories, categories =>
  categories.filter(x => x.isFeatured === true).slice(0, 8)
);

export const selectCurrentEditCategory = createSelector(
  [selectCategoryEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export default categorySlice;
