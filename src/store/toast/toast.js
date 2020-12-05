import React, { useState, createContext } from 'react';

import { nanoid } from 'nanoid';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type, message }) => {
    setToasts([...toasts, { id: nanoid(), type, message }]);
  };

  const success = message => {
    setToasts([...toasts, { id: nanoid(), type: 'success', message }]);
  };
  const info = message => {
    setToasts([...toasts, { id: nanoid(), type: 'info', message }]);
  };
  const warn = message => {
    setToasts([...toasts, { id: nanoid(), type: 'warn', message }]);
  };
  const error = message => {
    setToasts([...toasts, { id: nanoid(), type: 'error', message }]);
  };

  const removeToast = id => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, info, warn, error }}>
      {children}
    </ToastContext.Provider>
  );
}

export const successToast = message => ({ type: 'success', message });
export const infoToast = message => ({ type: 'info', message });
export const warnToast = message => ({ type: 'warn', message });
export const errorToast = message => ({ type: 'error', message });
