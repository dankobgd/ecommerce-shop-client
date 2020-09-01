import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const sliceName = 'toasts';

const toastSlice = createSlice({
  name: sliceName,
  initialState: [],
  reducers: {
    addToast: {
      reducer: (state, { payload }) => {
        state.push(payload);
      },
      prepare: ({ type, message }) => {
        const id = nanoid();
        return { payload: { id, type, message } };
      },
    },
    removeToast: (state, { payload }) => state.filter(toast => toast.id !== payload),
  },
});

// helpers to create toast object
export const successToast = message => ({ type: 'success', message });
export const infoToast = message => ({ type: 'info', message });
export const warnToast = message => ({ type: 'warn', message });
export const errorToast = message => ({ type: 'error', message });

export const selectToasts = state => state[sliceName];

export default toastSlice;
