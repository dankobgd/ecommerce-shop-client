import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import productSlice from '../product/productSlice';
import toastSlice, { successToast } from '../toast/toastSlice';
import userSlice from '../user/userSlice';

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

export const reviewGetAll = createAsyncThunk(`${sliceName}/getAll`, async (qs, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(qs);
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

export const reviewGetAllForProduct = createAsyncThunk(
  `${sliceName}/getAllForProduct`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const reviews = await api.products.getReviews(id);
      dispatch(productSlice.actions.setReviewIds(reviews));
      return reviews;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
    [reviewGetAllForProduct.fulfilled]: (state, { payload }) => {
      reviewAdapter.upsertMany(state, payload);
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

export const selectCurrentProductReviews = createSelector(
  [state => state[productSlice.name].currentId, selectAllReviews],
  (id, reviews) => reviews.filter(rev => rev.productId === id)
);

export const selectUserReview = createSelector(
  [state => state[userSlice.name].profile.id, selectCurrentProductReviews],
  (id, revs) => revs.find(rev => rev.userId === id)
);

export const selectAverageProductRating = createSelector(
  [state => state[productSlice.name].entities[state[productSlice.name].currentId]?.reviews, selectReviewEntities],
  (ids, entities) => {
    if (ids && ids.length > 0) {
      const arr = ids.map(id => entities[id]);
      return arr.length > 0 ? arr.reduce((sum, val) => sum + val?.rating, 0) / arr.length : null;
    }
    return null;
  }
);

export default reviewSlice;
