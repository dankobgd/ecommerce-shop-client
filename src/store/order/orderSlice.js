import { navigate } from '@reach/router';
import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import cartSlice from '../cart/cartSlice';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'orders';

export const orderCreate = createAsyncThunk(`${sliceName}/create`, async (details, { dispatch, rejectWithValue }) => {
  try {
    const order = await api.orders.create(details);
    dispatch(toastSlice.actions.addToast(successToast('Order created')));
    dispatch(cartSlice.actions.clearCartItems());
    navigate('/orders');
    return order;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const orderGetAll = createAsyncThunk(`${sliceName}/getAll`, async (details, { rejectWithValue }) => {
  try {
    const orders = await api.orders.getAll(details);
    return orders;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const orderGetAllForUser = createAsyncThunk(
  `${sliceName}/getOrdersForUser`,
  async ({ id, params }, { rejectWithValue }) => {
    try {
      console.log('wtf shit ass id: ', id);
      console.log('wtf shit ass params: ', params);
      const orders = await api.users.getOrders(id, params);
      return orders;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderAdapter = createEntityAdapter();

const initialState = orderAdapter.getInitialState({
  editId: null,
  pagination: null,
});

const orderSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
  },
  extraReducers: {
    [orderCreate.fulfilled]: orderAdapter.addOne,
    [orderGetAll.fulfilled]: (state, { payload }) => {
      orderAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [orderGetAllForUser.fulfilled]: (state, { payload }) => {
      orderAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
  },
});

export const {
  selectById: selectOrderById,
  selectAll: selectAllOrders,
  selectEntities: selectOrderEntities,
  selectIds: selectOrderIds,
  selectTotal: selectOrderTotal,
} = orderAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectCurrentEditOrder = createSelector(
  [selectOrderEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export const selectUserOrders = uid =>
  createSelector([selectOrderEntities], entities => entities.map(ord => ord.userId === uid));

export default orderSlice;
