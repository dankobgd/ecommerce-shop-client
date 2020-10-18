import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import api from '../../api';
import productSlice from '../product/productSlice';

const brandSchema = new schema.Entity('brands');
const categorySchema = new schema.Entity('categories');
const productSchema = new schema.Entity('products', {
  brand: brandSchema,
  category: categorySchema,
});

export const sliceName = 'search';

export const filterProducts = createAsyncThunk(
  `${sliceName}/filterProducts`,
  async (qs, { dispatch, rejectWithValue }) => {
    try {
      const params = new URLSearchParams(qs);
      const products = await api.products.getAll(params);
      const { entities } = normalize(products.data, [productSchema]);
      dispatch(productSlice.actions.upsertMany(entities.products));
      return { entities, meta: products.meta };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchAdapter = createEntityAdapter();

const initialState = searchAdapter.getInitialState({
  pagination: null,
  filters: {
    tags: [],
    brands: [],
    categories: [],
    priceMin: '',
    priceMax: '',
  },
});

const searchSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = {
        ...state.filters,
        ...payload,
      };
    },
  },
  extraReducers: {
    [filterProducts.fulfilled]: (state, { payload }) => {
      const result = payload?.entities?.products;
      const meta = payload?.meta;

      if (!result) {
        state.entities = {};
        state.ids = [];
        state.pagination = meta;
      } else {
        searchAdapter.setAll(state, result);
        state.pagination = meta;
      }
    },
  },
});

export const {
  selectById: selectSearchProductById,
  selectAll: selectAllSearchProducts,
  selectEntities: selectSearchProductEntities,
  selectIds: selectSearchProductIds,
  selectTotal: selectSearchProductTotal,
} = searchAdapter.getSelectors(state => state[sliceName]);

export const selectPaginationMeta = state => state[sliceName].pagination;
export const selectFilters = state => state[sliceName].filters;

export default searchSlice;
