import React from 'react';

import { Button, CircularProgress } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

export default function SubmitButton({
  children,
  className,
  color = 'primary',
  margin = 'normal',
  variant = 'contained',
  ...rest
}) {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  return (
    <Button
      type='submit'
      color={color}
      margin={margin}
      variant={variant}
      disabled={isSubmitting}
      className={className}
      {...rest}
    >
      {isSubmitting && <CircularProgress size={20} />}
      {!isSubmitting && children}
    </Button>
  );
}
