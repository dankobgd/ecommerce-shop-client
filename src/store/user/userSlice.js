import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { navigate } from '@reach/router';

import toastsSlice, { successToast } from '../toasts/toastsSlice';
import api from '../../api';

export const sliceName = 'user';

export const getCurrentUser = createAsyncThunk(`${sliceName}/getCurrentUser`, async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await api.users.getCurrent();
    localStorage.setItem('ecommerce/logged_in', true);
    return user;
  } catch (error) {
    localStorage.setItem('ecommerce/logged_in', false);
    throw error;
  }
});

export const userSignup = createAsyncThunk(
  `${sliceName}/userSignup`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const user = await api.users.signup(credentials);
      navigate('/');
      dispatch(toastsSlice.actions.addToast(successToast('You signed up successfully')));
      localStorage.setItem('ecommerce/logged_in', true);
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
      dispatch(toastsSlice.actions.addToast(successToast(`Welcome ${user.username || user.firstName || user.email}`)));
      localStorage.setItem('ecommerce/logged_in', true);
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
      dispatch(toastsSlice.actions.addToast(successToast('Goodbye friend')));
      localStorage.setItem('logged_in', false);
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
      dispatch(toastsSlice.actions.addToast(successToast('Password reset Email has been sent')));
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
      dispatch(toastsSlice.actions.addToast(successToast('Password updated')));
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
      dispatch(toastsSlice.actions.addToast(successToast('Password updated')));
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
      dispatch(toastsSlice.actions.addToast(successToast('Avatar uploaded')));
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
      dispatch(toastsSlice.actions.addToast(successToast('Avatar deleted')));
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
  },
  reducers: {
    clearErrors: state => {
      state.error = null;
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

    [userUploadAvatar.fulfilled]: (state, { payload }) => {
      state.profile.avatarUrl = payload.avatarUrl;
      state.profile.publicId = payload.publicId;
    },

    [userDeleteAvatar.fulfilled]: state => {
      state.profile.avatarUrl = null;
      state.profile.publicId = null;
    },
  },
});

export const selectUserProfile = state => state.user.profile;
export const selectIsUserAuthenticated = state => state.user.isAuthenticated;

export default userSlice;
