import React from 'react';

import { Button, CircularProgress } from '@material-ui/core';

export default function SubmitButton({
  children,
  className,
  color = 'primary',
  margin = 'normal',
  variant = 'contained',
  disabled = false,
  loading,
  ...rest
}) {
  return (
    <Button
      type='submit'
      color={color}
      margin={margin}
      variant={variant}
      disabled={loading || !!disabled}
      className={className}
      {...rest}
    >
      {loading && <CircularProgress size={20} />}
      {!loading && children}
    </Button>
  );
}
