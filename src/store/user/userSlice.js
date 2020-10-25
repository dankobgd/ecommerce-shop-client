import { navigate } from '@reach/router';
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import api from '../../api';
import toastSlice, { successToast } from '../toast/toastSlice';

export const sliceName = 'user';

export const getCurrentUser = createAsyncThunk(`${sliceName}/getCurrentUser`, async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await api.users.getCurrent();
    return user;
  } catch (error) {
    throw error;
  }
});

export const userSignup = createAsyncThunk(
  `${sliceName}/userSignup`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const user = await api.users.signup(credentials);
      navigate('/');
      dispatch(toastSlice.actions.addToast(successToast('You signed up successfully')));
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userLogin = createAsyncThunk(
  `${sliceName}/userLogin`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const user = await api.users.login(credentials);
      navigate('/');
      dispatch(toastSlice.actions.addToast(successToast(`Welcome ${user.username || user.firstName || user.email}`)));
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userLogout = createAsyncThunk(
  `${sliceName}/userLogout`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await api.users.logout(credentials);
      navigate('/');
      dispatch(toastSlice.actions.addToast(successToast('Goodbye friend')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userForgotPassword = createAsyncThunk(
  `${sliceName}/userForgotPassword`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await api.users.forgotPassword(credentials);
      dispatch(toastSlice.actions.addToast(successToast('Password reset Email has been sent')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userResetPassword = createAsyncThunk(
  `${sliceName}/userResetPassword`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await api.users.resetPassword(credentials);
      navigate('/');
      dispatch(toastSlice.actions.addToast(successToast('Password updated')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userChangePassword = createAsyncThunk(
  `${sliceName}/userChangePassword`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await api.users.changePassword(credentials);
      dispatch(toastSlice.actions.addToast(successToast('Password updated')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userUploadAvatar = createAsyncThunk(
  `${sliceName}/uploadUserAvatar`,
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const imgData = await api.users.uploadAvatar(formData);
      dispatch(toastSlice.actions.addToast(successToast('Avatar uploaded')));
      return imgData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userDeleteAvatar = createAsyncThunk(
  `${sliceName}/deleteUserAvatar`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.users.deleteAvatar();
      dispatch(toastSlice.actions.addToast(successToast('Avatar deleted')));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userUpdateProfileDetails = createAsyncThunk(
  `${sliceName}/userUpdateProfileDetails`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      const user = await api.users.update(details);
      dispatch(toastSlice.actions.addToast(successToast('Profile details updated')));
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const wishlistAddProduct = createAsyncThunk(
  `${sliceName}/wishlistAddProduct`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      await api.users.wishlistAdd(details);
      dispatch(toastSlice.actions.addToast(successToast('Product added to wishlist')));
      return details;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const wishlistGetProducts = createAsyncThunk(
  `${sliceName}/wishlistGetProducts`,
  async (qs, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(qs);
      const wishlist = await api.users.wishlistGet(params);
      return wishlist;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const wishlistDeleteProduct = createAsyncThunk(
  `${sliceName}/wishlistDeleteProduct`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      await api.users.wishlistDelete(details);
      dispatch(toastSlice.actions.addToast(successToast('Product removed from wishlist')));
      return details;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const wishlistClear = createAsyncThunk(
  `${sliceName}/wishlistClear`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      const msg = await api.users.wishlistClear(details);
      dispatch(toastSlice.actions.addToast(successToast('Wishlist cleared')));
      return msg;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createAddress = createAsyncThunk(
  `${sliceName}/createAddress`,
  async (details, { dispatch, rejectWithValue }) => {
    try {
      const address = await api.users.createAddress(details);
      dispatch(toastSlice.actions.addToast(successToast('Address cleared')));
      return address;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAddress = createAsyncThunk(`${sliceName}/getAddress`, async (id, { rejectWithValue }) => {
  try {
    const address = await api.users.getAddress(id);
    return address;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getAddresses = createAsyncThunk(`${sliceName}/getAddresses`, async (_, { rejectWithValue }) => {
  try {
    const addresses = await api.users.getAddresses();
    return addresses;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateAddress = createAsyncThunk(
  `${sliceName}/updateAddress`,
  async ({ id, details }, { dispatch, rejectWithValue }) => {
    try {
      const address = await api.users.updateAddress(id, details);
      dispatch(toastSlice.actions.addToast(successToast('Address updated')));
      return address;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  `${sliceName}/deleteAddress`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const msg = await api.users.deleteAddress(id);
      dispatch(toastSlice.actions.addToast(successToast('Address deleted')));
      return msg;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: sliceName,
  initialState: {
    profile: null,
    isAuthenticated: false,
    wishlist: [],
    addresses: [],
    editAddressId: null,
  },
  reducers: {
    setEditAddressId: (state, { payload }) => {
      state.editAddressId = payload;
    },
  },
  extraReducers: {
    [getCurrentUser.rejected]: state => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    [getCurrentUser.fulfilled]: (state, { payload }) => {
      state.profile = payload;
      state.isAuthenticated = true;
    },
    [userSignup.fulfilled]: (state, { payload }) => {
      state.profile = payload;
      state.isAuthenticated = true;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.profile = payload;
      state.isAuthenticated = true;
    },
    [userLogout.fulfilled]: state => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    [userUpdateProfileDetails.fulfilled]: (state, { payload }) => {
      Object.keys(payload).forEach(key => {
        state.profile[key] = payload[key];
      });
    },
    [userUploadAvatar.fulfilled]: (state, { payload }) => {
      state.profile.avatarUrl = payload.avatarUrl;
      state.profile.publicId = payload.publicId;
    },
    [userDeleteAvatar.fulfilled]: state => {
      state.profile.avatarUrl = null;
      state.profile.publicId = null;
    },
    [wishlistAddProduct.fulfilled]: (state, { payload }) => {
      state.wishlist.push(payload.productId);
    },
    [wishlistGetProducts.fulfilled]: (state, { payload }) => {
      const ids = payload.map(x => x.id);
      state.wishlist = [...new Set([...state.wishlist, ...ids])];
    },
    [wishlistDeleteProduct.fulfilled]: (state, { payload }) => {
      const idx = state.wishlist.findIndex(x => x === payload.productId);
      state.wishlist.splice(idx, 1);
    },
    [wishlistClear.fulfilled]: state => {
      state.wishlist = [];
    },

    [createAddress.fulfilled]: (state, { payload }) => {
      state.addresses.push(payload);
    },
    [getAddress.fulfilled]: (state, { payload }) => {
      const exists = state.addresses.some(x => x.id === payload.id);
      if (!exists) {
        state.addresses.push(payload);
      }
    },
    [getAddresses.fulfilled]: (state, { payload }) => {
      state.addresses = payload;
    },
    [updateAddress.fulfilled]: (state, { payload }) => {
      const idx = state.addresses.findIndex(x => x.id === payload.id);
      state.addresses[idx] = payload;
    },
    [deleteAddress.fulfilled]: (state, { payload }) => {
      const idx = state.addresses.findIndex(x => x === payload);
      state.addresses.splice(idx, 1);
    },
  },
});

export const selectUserProfile = state => state[sliceName].profile;
export const selectIsUserAuthenticated = state => state[sliceName].isAuthenticated;
export const selectWishlistProductIds = state => state[sliceName].wishlist;

export const selectUserAddresses = state => state[sliceName].addresses ?? [];
export const selectEditAddressId = state => state[sliceName].editAddressId;

export const selectCurrentEditAddress = createSelector(
  [selectUserAddresses, selectEditAddressId],
  (addresses, editId) => addresses.find(x => x.id === editId)
);

export default userSlice;
