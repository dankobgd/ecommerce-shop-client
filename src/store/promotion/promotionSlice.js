import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'promotions';

export const promotionCreate = createAsyncThunk(
  `${sliceName}/create`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      const promotion = await api.promotions.create(details);
      dispatch(toastSlice.actions.addToast(successToast('Promotion created')));
      return promotion;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const promotionUpdate = createAsyncThunk(
  `${sliceName}/update`,
  async ({ code, details }, { dispatch, rejectWithValue }) => {
    try {
      const promotion = await api.promotions.update(code, details);
      dispatch(toastSlice.actions.addToast(successToast('Promotion details updated')));
      const updateSignature = { id: code, changes: promotion };
      return updateSignature;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const promotionGetAll = createAsyncThunk(`${sliceName}/getAll`, async (qs, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(qs);
    const promotions = await api.promotions.getAll(params);
    return promotions;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const promotionGet = createAsyncThunk(`${sliceName}/get`, async (code, { rejectWithValue }) => {
  try {
    const promotion = await api.promotions.get(code);
    return promotion;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const promotionDelete = createAsyncThunk(`${sliceName}/delete`, async (code, { dispatch, rejectWithValue }) => {
  try {
    await api.promotions.delete(code);
    dispatch(toastSlice.actions.addToast(successToast('Promotion deleted')));
    return code;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const promotionGetStatus = createAsyncThunk(`${sliceName}/getStatus`, async (code, { rejectWithValue }) => {
  try {
    const status = await api.promotions.getStatus(code);
    return status;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const promotionAdapter = createEntityAdapter({
  selectId: p => p.promoCode,
});

const initialState = promotionAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const promotionSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [promotionCreate.fulfilled]: promotionAdapter.addOne,
    [promotionGet.fulfilled]: promotionAdapter.upsertOne,
    [promotionGetAll.fulfilled]: (state, { payload }) => {
      promotionAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [promotionUpdate.fulfilled]: promotionAdapter.updateOne,
    [promotionDelete.fulfilled]: promotionAdapter.removeOne,
  },
});

export const {
  selectById: selectPromotionByCode,
  selectAll: selectAllPromotions,
  selectEntities: selectPromotionEntities,
  selectIds: selectPromotionIds,
  selectTotal: selectPromotionTotal,
} = promotionAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectCurrentEditPromotion = createSelector(
  [selectPromotionEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export const selectPromotionForCart = createSelector(
  [selectPromotionEntities, state => state.cart.promotion],
  (entities, code) => (code ? entities[code] : null)
);

export default promotionSlice;
