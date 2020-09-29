import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

const brandSchema = new schema.Entity('brands');
const categorySchema = new schema.Entity('categories');
const productSchema = new schema.Entity('products', {
  brand: brandSchema,
  category: categorySchema,
});

export const sliceName = 'products';

export const productCreate = createAsyncThunk(
  `${sliceName}/create`,
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const product = await api.products.create(formData);
      dispatch(toastSlice.actions.addToast(successToast('Product created')));
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productUpdate = createAsyncThunk(
  `${sliceName}/update`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const product = await api.products.update(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Product details updated')));
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productGetAll = createAsyncThunk(`${sliceName}/getAll`, async (params, { rejectWithValue }) => {
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

export const productGet = createAsyncThunk(`${sliceName}/get`, async (id, { rejectWithValue }) => {
  try {
    const product = await api.products.get(id);
    return product;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productDelete = createAsyncThunk(`${sliceName}/delete`, async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.products.delete(id);
    dispatch(toastSlice.actions.addToast(successToast('Product deleted')));
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGetProperties = createAsyncThunk(`${sliceName}/getProperties`, async (_, { rejectWithValue }) => {
  try {
    const props = await api.products.getProperties();
    return props;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGetFeatured = createAsyncThunk(`${sliceName}/getFeatured`, async (params, { rejectWithValue }) => {
  try {
    const featured = await api.products.getFeatured(params);
    const { entities } = normalize(featured.data, [productSchema]);

    return {
      entities,
      meta: featured.meta,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState({
  editId: null,
  currentId: null,
  pagination: null,
  properties: [],
  filters: {},
});

const productSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setTagIds: (state, { payload }) => {
      const idx = payload[0]?.productId;
      const idsArr = payload.map(x => x.id);
      if (idsArr.length > 0) {
        state.entities[idx].tags = idsArr;
      }
    },
    setImageIds: (state, { payload }) => {
      const idx = payload[0]?.productId;
      const idsArr = payload.map(x => x.id);
      if (idsArr.length > 0) {
        state.entities[idx].images = idsArr;
      }
    },
    setReviewIds: (state, { payload }) => {
      const idx = payload[0]?.productId;
      const idsArr = payload.map(x => x.id);
      if (idsArr.length > 0) {
        state.entities[idx].reviews = idsArr;
      }
    },
    setEditId: (state, { payload }) => {
      state.editId = payload;
    },
    setCurrentId: (state, { payload }) => {
      state.currentId = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    setpPriceFilter: (state, { payload }) => {
      state.filters.price = [...payload];
    },
  },
  extraReducers: {
    [productCreate.fulfilled]: productAdapter.addOne,
    [productGet.fulfilled]: productAdapter.upsertOne,
    [productGetAll.fulfilled]: (state, { payload }) => {
      productAdapter.upsertMany(state, payload.entities.products);
      state.pagination = payload.meta;
    },
    [productUpdate.fulfilled]: productAdapter.upsertOne,
    [productDelete.fulfilled]: productAdapter.removeOne,
    [productGetProperties.fulfilled]: (state, { payload }) => {
      state.properties = payload;
    },
    [productGetFeatured.fulfilled]: (state, { payload }) => {
      productAdapter.upsertMany(state, payload.entities.products);
      state.pagination = payload.meta;
    },
  },
});

export const {
  selectById: selectProductById,
  selectAll: selectAllProducts,
  selectEntities: selectProductEntities,
  selectIds: selectProductIds,
  selectTotal: selectProductTotal,
} = productAdapter.getSelectors(state => state[sliceName]);

export const selectEditId = state => state[sliceName].editId;
export const selectCurrentId = state => state[sliceName].currentId;
export const selectPaginationMeta = state => state[sliceName].pagination;

export const selectProductVariants = createSelector(
  state => state[sliceName].properties,
  variants => variants
);

export const selectCurrentProduct = createSelector(
  [selectProductEntities, selectCurrentId],
  (entities, currentId) => entities[currentId]
);

export const selectCurrentEditProduct = createSelector(
  [selectProductEntities, selectEditId],
  (entities, editId) => entities[editId]
);

export const selectFeaturedProducts = createSelector(selectAllProducts, products =>
  products.filter(x => x.isFeatured === true)
);

export const selectTopFeaturedProducts = createSelector(selectFeaturedProducts, products => products.slice(0, 3));
export const selectMostSoldProducts = createSelector(selectFeaturedProducts, products => products.slice(0, 3));
export const selectBeastDealsProducts = createSelector(selectFeaturedProducts, products => products.slice(0, 3));

// export const selectMostSoldProducts = createSelector(selectAllProducts, products =>
//   products.filter(x => x.isFeatured === true)
// );

// export const selectBeastDealsProducts = createSelector(selectAllProducts, products =>
//   products.filter(x => x.isFeatured === true)
// );

export default productSlice;
