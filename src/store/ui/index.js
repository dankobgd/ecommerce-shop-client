import { createReducer, createSelector } from '@reduxjs/toolkit';

const actionName = action => action.substring(0, action.lastIndexOf('/'));

const initialState = {
  loading: {},
  error: {},
};

const uiReducer = createReducer(initialState, builder => {
  builder
    .addMatcher(
      action => action.type.endsWith('/pending'),
      (state, action) => {
        state.loading[actionName(action.type)] = true;
        state.error[actionName(action.type)] = null;
      }
    )
    .addMatcher(
      action => action.type.endsWith('/fulfilled'),
      (state, action) => {
        state.loading[actionName(action.type)] = false;
        state.error[actionName(action.type)] = null;
      }
    )
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading[actionName(action.type)] = false;
        state.error[actionName(action.type)] = action.payload;
      }
    );
});

const selectLoading = state => state.ui.loading;
const selectError = state => state.ui.error;

export const selectUIState = action =>
  createSelector([selectLoading, selectError], (loadingState, errorState) => ({
    error: errorState[action.typePrefix] || null,
    loading: loadingState[action.typePrefix] || null,
  }));

export default uiReducer;
