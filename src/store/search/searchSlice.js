import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import api from '../../api';

const brandSchema = new schema.Entity('brands');
const categorySchema = new schema.Entity('categories');
const productSchema = new schema.Entity('products', {
  brand: brandSchema,
  category: categorySchema,
});

export const sliceName = 'search';

export const filterProducts = createAsyncThunk(`${sliceName}/filterProducts`, async (params, { rejectWithValue }) => {
  try {
    const products = await api.products.getAll(params);
    const { entities } = normalize(products.data, [productSchema]);

    return {
      entities,
      meta: products.meta,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const searchAdapter = createEntityAdapter();

const initialState = searchAdapter.getInitialState({
  pagination: null,
  filterQueryString: '',
});

const searchSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setFilterQueryString: (state, { payload }) => {
      state.filterQueryString = payload;
    },
    clearSearchResults: state => {
      state.searchResults = [];
    },
  },
  extraReducers: {
    [filterProducts.fulfilled]: (state, { payload }) => {
      searchAdapter.setAll(state, payload?.entities?.products || {});
      state.pagination = payload?.meta || null;
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
export const selectFilterQueryString = state => state[sliceName].filterQueryString;

export default searchSlice;
