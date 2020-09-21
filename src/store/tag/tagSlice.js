import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'tag';

export const tagCreate = createAsyncThunk(`${sliceName}/tagCreate`, async (details, { dispatch, rejectWithValue }) => {
  try {
    const tag = await api.tags.create(details);
    dispatch(toastSlice.actions.addToast(successToast('Tag created')));
    return tag;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const tagUpdate = createAsyncThunk(
  `${sliceName}/tagUpdate`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const tag = await api.tags.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Tag details updated')));
      return tag;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const tagGetAll = createAsyncThunk(`${sliceName}/tagGetAll`, async (params, { rejectWithValue }) => {
  try {
    const tags = await api.tags.getAll(params);
    return tags;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const tagGet = createAsyncThunk(`${sliceName}/tagGet`, async (id, { rejectWithValue }) => {
  try {
    const tag = await api.tags.get(id);
    return tag;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const tagDelete = createAsyncThunk(`${sliceName}/tagDelete`, async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.tags.delete(id);
    dispatch(toastSlice.actions.addToast(successToast('Tag deleted')));
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const tagAdapter = createEntityAdapter();

const initialState = tagAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const tagSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [tagCreate.fulfilled]: tagAdapter.addOne,
    [tagGet.fulfilled]: tagAdapter.upsertOne,
    [tagGetAll.fulfilled]: (state, { payload }) => {
      tagAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [tagUpdate.fulfilled]: tagAdapter.upsertOne,
    [tagDelete.fulfilled]: tagAdapter.removeOne,
  },
});

export const {
  selectById: selectTagById,
  selectAll: selectAllTags,
  selectEntities: selectTagEntities,
  selectIds: selectTagIds,
  selectTotal: selectTagTotal,
} = tagAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectManyTags = ids => createSelector(selectTagEntities, entities => ids.map(id => entities[id]));

export const selectCurrentEditTag = createSelector(
  [selectTagEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export default tagSlice;
