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

export const tagGetAll = createAsyncThunk(`${sliceName}/tagGetAll`, async (_, { rejectWithValue }) => {
  try {
    const tags = await api.tags.getAll();
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
  selectedId: null,
});

const tagSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setSelectedId: (state, { payload }) => {
      state.selectedId = payload;
    },
  },
  extraReducers: {
    [tagCreate.fulfilled]: tagAdapter.addOne,
    [tagGet.fulfilled]: tagAdapter.upsertOne,
    [tagGetAll.fulfilled]: tagAdapter.setAll,
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

export const selectSelectedId = state => state[sliceName].selectedId;

export const selectManyTags = ids => createSelector(selectTagEntities, entities => ids.map(id => entities[id]));

export const selectCurrentTag = createSelector(
  [selectTagEntities, selectSelectedId],
  (entities, currentId) => entities[currentId]
);

export default tagSlice;
