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
  hasSearched: false,
  mainFilters: {
    tags: [],
    brands: [],
    categories: [],
  },
  priceFilters: {
    priceMin: '',
    priceMax: '',
  },
  priceValues: {
    priceMin: '',
    priceMax: '',
  },
  specificFilters: {},
});

const searchSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setHasSearched: (state, { payload }) => {
      state.hasSearched = payload;
    },
    setMainFilters: (state, { payload }) => {
      const { name, items } = payload;
      state.mainFilters = {
        ...state.mainFilters,
        [name]: items,
      };
    },
    initSpecificFilters: (state, { payload }) => {
      state.specificFilters = {
        ...state.specificFilters,
        ...payload,
      };
    },
    setSpecificFilters: (state, { payload }) => {
      const { name, items } = payload;
      state.specificFilters = {
        ...state.specificFilters,
        [name]: items,
      };
    },
    setPriceFilters: (state, { payload }) => {
      const { name, values } = payload;
      state.priceFilters = {
        ...state.priceFilters,
        [name]: values.value,
      };
    },
    setPriceValues: (state, { payload }) => {
      const { name, values } = payload;
      state.priceValues = {
        ...state.priceValues,
        [name]: values.value,
      };
    },

    filterChoiceClicked: (state, { payload }) => {
      const { name, value } = payload;
      state.mainFilters = {
        ...{
          tags: [],
          brands: [],
          categories: [],
        },
        ...{
          [name]: [value],
        },
      };
      state.specificFilters = Object.keys(state.specificFilters).reduce((acc, key) => {
        acc[key] = [];
        return acc;
      }, {});
      state.priceFilters = { priceMin: '', priceMax: '' };
      state.priceValues = { priceMin: '', priceMax: '' };
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
export const selectHasSearched = state => state[sliceName].hasSearched;
export const selectMainFilters = state => state[sliceName].mainFilters;
export const selectSpecificFilters = state => state[sliceName].specificFilters;
export const selectPriceFilters = state => state[sliceName].priceFilters;
export const selectPriceValues = state => state[sliceName].priceValues;

export default searchSlice;
