import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { navigate } from '@reach/router';

import toastsSlice, { successToast } from '../toasts/toastsSlice';
import api from '../../api/api';

export const sliceName = 'user';

export const getCurrentUser = createAsyncThunk(`${sliceName}/getCurrentUser`, () => {
  api.users.getCurrent().then(user => user);
  // i dont consider this to be an error when user is not authenticated...
});

export const userSignup = createAsyncThunk(
  `${sliceName}/userSignup`,
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const user = await api.users.signup(credentials);
      navigate('/');
      dispatch(toastsSlice.actions.addToast(successToast('You signed up successfully')));
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
      dispatch(toastsSlice.actions.addToast(successToast('Password updated sucessfully')));
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
    error: null,
    loading: false,
  },
  reducers: {
    clearErrors: state => {
      state.error = null;
    },
  },
  extraReducers: {
    [getCurrentUser.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [getCurrentUser.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.error = null;
        state.loading = false;
        state.profile = payload;
        state.isAuthenticated = true;
      } else {
        state.error = null;
        state.loading = false;
        state.profile = null;
        state.isAuthenticated = false;
      }
    },

    [userSignup.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [userSignup.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    [userSignup.fulfilled]: (state, { payload }) => {
      state.error = null;
      state.loading = false;
      state.profile = payload;
      state.isAuthenticated = true;
    },

    [userLogin.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.error = null;
      state.loading = false;
      state.profile = payload;
      state.isAuthenticated = true;
    },

    [userLogout.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [userLogout.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    [userLogout.fulfilled]: state => {
      state.error = null;
      state.loading = false;
      state.profile = null;
      state.isAuthenticated = false;
    },
  },
});

export const selectUser = state => state.user;
export const selectUserProfile = state => state.user.profile;
export const selectIsUserAuthenticated = state => state.user.isAuthenticated;
export const selectIsUserLoading = state => state.user.loading;
export const selectUserError = state => state.user.error;

export default userSlice;
