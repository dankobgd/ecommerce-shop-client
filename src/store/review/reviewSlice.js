import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'reviews';

export const reviewCreate = createAsyncThunk(`${sliceName}/create`, async (details, { dispatch, rejectWithValue }) => {
  try {
    const review = await api.reviews.create(details);
    dispatch(toastSlice.actions.addToast(successToast('Review posted')));
    return review;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const reviewUpdate = createAsyncThunk(
  `${sliceName}/update`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const review = await api.reviews.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Review details updated')));
      return review;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reviewGetAll = createAsyncThunk(`${sliceName}/getAll`, async (params, { rejectWithValue }) => {
  try {
    const reviews = await api.reviews.getAll(params);
    return reviews;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const reviewGet = createAsyncThunk(`${sliceName}/get`, async (id, { rejectWithValue }) => {
  try {
    const review = await api.reviews.get(id);
    return review;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const reviewDelete = createAsyncThunk(`${sliceName}/delete`, async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.reviews.delete(id);
    dispatch(toastSlice.actions.addToast(successToast('Review deleted')));
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const reviewAdapter = createEntityAdapter();

const initialState = reviewAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const reviewSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [reviewCreate.fulfilled]: reviewAdapter.addOne,
    [reviewGet.fulfilled]: reviewAdapter.upsertOne,
    [reviewGetAll.fulfilled]: (state, { payload }) => {
      reviewAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [reviewUpdate.fulfilled]: reviewAdapter.upsertOne,
    [reviewDelete.fulfilled]: reviewAdapter.removeOne,
  },
});

export const {
  selectById: selectReviewById,
  selectAll: selectAllReviews,
  selectEntities: selectReviewEntities,
  selectIds: selectReviewIds,
  selectTotal: selectReviewTotal,
} = reviewAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectCurrentEditReview = createSelector(
  [selectReviewEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export default reviewSlice;
