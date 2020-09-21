import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'product';

export const productCreate = createAsyncThunk(
  `${sliceName}/productCreate`,
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
  `${sliceName}/productUpdate`,
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

export const productGetAll = createAsyncThunk(`${sliceName}/productGetAll`, async (params, { rejectWithValue }) => {
  try {
    const products = await api.products.getAll(params);
    return products;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGet = createAsyncThunk(`${sliceName}/productGet`, async (id, { rejectWithValue }) => {
  try {
    const product = await api.products.get(id);
    return product;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productDelete = createAsyncThunk(
  `${sliceName}/productDelete`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.products.delete(id);
      dispatch(toastSlice.actions.addToast(successToast('Product deleted')));
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productGetTags = createAsyncThunk(`${sliceName}/productGetTags`, async (id, { rejectWithValue }) => {
  try {
    const tags = await api.products.getTags(id);
    return tags;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGetImages = createAsyncThunk(`${sliceName}/productGetImages`, async (id, { rejectWithValue }) => {
  try {
    const images = await api.products.getImages(id);
    return images;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const productGetProperties = createAsyncThunk(
  `${sliceName}/productGetProperties`,
  async (_, { rejectWithValue }) => {
    try {
      const props = await api.products.getProperties();
      return props;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productGetFeatured = createAsyncThunk(
  `${sliceName}/productGetFeatured`,
  async (params, { rejectWithValue }) => {
    try {
      const featured = await api.products.getFeatured(params);
      return featured;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
      productAdapter.upsertMany(state, payload.data);
      state.pagination = payload.meta;
    },
    [productUpdate.fulfilled]: productAdapter.upsertOne,
    [productDelete.fulfilled]: productAdapter.removeOne,
    [productGetTags.fulfilled]: (state, { payload }) => {
      if (payload.length > 0) {
        const idx = payload[0].productId;
        const tagIds = payload.map(x => x.id);
        state.entities[idx].tags = tagIds;
      }
    },
    [productGetImages.fulfilled]: (state, { payload }) => {
      if (payload.length > 0) {
        const idx = payload[0].productId;
        const imgIds = payload.map(x => x.id);
        state.entities[idx].images = imgIds;
      }
    },
    [productGetProperties.fulfilled]: (state, { payload }) => {
      state.properties = payload;
    },
    [productGetFeatured.fulfilled]: (state, { payload }) => {
      productAdapter.upsertMany(state, payload.data);
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
