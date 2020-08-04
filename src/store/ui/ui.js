import { createReducer } from '@reduxjs/toolkit';

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

export const selectUIState = action => state => {
  const error = state.ui.error[action.typePrefix] || null;
  const loading = state.ui.loading[action.typePrefix] || false;
  return { error, loading };
};

export default uiReducer;
