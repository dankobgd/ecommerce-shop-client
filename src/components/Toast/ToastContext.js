import React, { useState, createContext } from 'react';

import { nanoid } from 'nanoid';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const success = message => {
    setToasts([...toasts, { id: nanoid(), type: 'success', message }]);
  };
  const info = message => {
    setToasts([...toasts, { id: nanoid(), type: 'info', message }]);
  };
  const warn = message => {
    setToasts([...toasts, { id: nanoid(), type: 'warning', message }]);
  };
  const error = message => {
    setToasts([...toasts, { id: nanoid(), type: 'error', message }]);
  };

  const removeToast = id => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, removeToast, success, info, warn, error }}>
      {children}
    </ToastContext.Provider>
  );
}
