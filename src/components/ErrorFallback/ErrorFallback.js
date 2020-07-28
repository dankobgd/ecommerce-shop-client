import React from 'react';

export function ErrorFallback({ error, componentStack, resetErrorBoundary }) {
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>{componentStack}</pre>
      <button type='button' onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

export function ErrorFallbackAlertMessage({ error }) {
  return (
    <div role='alert'>
      <p style={{ color: '#222', padding: '0.5rem', border: '1px solid red', fontSize: 16 }}>{error.message}</p>
    </div>
  );
}
