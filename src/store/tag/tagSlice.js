import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

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
  } catch (error) {
    return rejectWithValue(error);
  }
});

const tagSlice = createSlice({
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
    [tagCreate.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [tagGet.fulfilled]: (state, { payload }) => {
      state.list.push(payload);
    },
    [tagGetAll.fulfilled]: (state, { payload }) => {
      state.list = payload;
    },
    [tagUpdate.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(b => b.id === payload.id);
      state.list[idx] = payload;
    },
    [tagDelete.fulfilled]: (state, { payload }) => {
      const idx = state.list.findIndex(x => x === payload);
      state.list.splice(idx, 1);
    },
  },
});

export const selectAllTags = state => state.tag.list;
export const selectSelectedId = state => state.tag.selectedId;

export const selectCurrentTag = createSelector([selectAllTags, selectSelectedId], (items, currentId) =>
  items.find(x => x.id === currentId)
);

export default tagSlice;
