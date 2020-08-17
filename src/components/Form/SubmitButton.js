import React from 'react';

import { Button } from '@material-ui/core';
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

  return (
    <div>
      <Button
        type='submit'
        color={color}
        margin={margin}
        variant={variant}
        disabled={formState.isSubmitting}
        className={className}
        fullWidth
        {...rest}
      >
        {children}
      </Button>
    </div>
  );
}
