import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
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

const getEmptyMainFilters = () => ({
  tags: [],
  brands: [],
  categories: [],
});
const getEmptyPriceFilters = () => ({
  priceMin: '',
  priceMax: '',
});
const getEmptySpecificFilters = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

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
    updateSpecificFilters: (state, { payload }) => {
      state.specificFilters = {
        ...getEmptySpecificFilters(state.specificFilters),
        ...payload,
      };
    },
    setPriceMinFilter: (state, { payload }) => {
      state.priceFilters = {
        ...state.priceFilters,
        priceMin: payload,
      };
    },
    setPriceMaxFilter: (state, { payload }) => {
      state.priceFilters = {
        ...state.priceFilters,
        priceMax: payload,
      };
    },
    setPriceValues: (state, { payload }) => {
      const { name, value } = payload;
      state.priceValues = {
        ...state.priceValues,
        [name]: value,
      };
    },
    clearPriceMin: state => {
      state.priceFilters = { ...state.priceFilters, priceMin: '' };
      state.priceValues = { ...state.priceValues, priceMin: '' };
    },
    clearPriceMax: state => {
      state.priceFilters = { ...state.priceFilters, priceMax: '' };
      state.priceValues = { ...state.priceValues, priceMax: '' };
    },
    clearAllFilters: state => {
      state.mainFilters = getEmptyMainFilters();
      state.specificFilters = getEmptySpecificFilters(state.specificFilters);
      state.priceFilters = getEmptyPriceFilters();
      state.priceValues = getEmptyPriceFilters();
    },
    filterChoiceClicked: (state, { payload }) => {
      const { name, value } = payload;
      state.mainFilters = {
        ...getEmptyMainFilters(),
        ...{
          [name]: [value],
        },
      };
      state.specificFilters = getEmptySpecificFilters(state.specificFilters);
      state.priceFilters = getEmptyPriceFilters();
      state.priceValues = getEmptyPriceFilters();
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

export const selectHasFilters = createSelector(
  [selectMainFilters, selectPriceFilters, selectSpecificFilters],
  (main, price, specific) => {
    const x = _.pickBy(main, v => v.length > 0);
    const y = _.pickBy(price, v => v.length > 0);
    const z = _.pickBy(specific, v => v.length > 0);
    return Object.keys(x).length > 0 || Object.keys(y).length > 0 || Object.keys(z).length > 0;
  }
);

export const selectHasSpecificFilters = createSelector(selectSpecificFilters, filters => {
  const obj = _.pickBy(filters, v => v.length > 0);
  return Object.keys(obj).length > 0;
});

export const selectChipFilters = createSelector(
  [selectMainFilters, selectPriceFilters, selectSpecificFilters],
  (main, price, specific) => {
    const chipData = [];

    Object.entries(main).forEach(([key, val]) => {
      val.forEach(v => {
        chipData.push({ key: `${key}_${v}`, label: v, name: key, values: val, value: v });
      });
    });
    Object.entries(price).forEach(([key, val]) => {
      const label = `${key.slice(5).charAt(0).toLowerCase() + key.slice(5).slice(1)}: $${val}`;
      if (val) {
        chipData.push({ key, label, name: key, values: val });
      }
    });

    const nonEmptySpecific = _.pickBy(specific, v => v.length > 0);
    Object.entries(nonEmptySpecific).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach(v => {
          chipData.push({ key: `${key}_${v}`, label: `${key}: ${v}`, name: key, values: val, value: v });
        });
      } else {
        chipData.push({ key: `${key}_${val}`, label: `${key}`, name: key, values: val });
      }
    });

    return chipData;
  }
);

export default searchSlice;
