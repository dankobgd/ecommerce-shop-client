import React from 'react';
import { Button } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

function SubmitButton({ children, className, color = 'primary', variant = 'contained', ...rest }) {
  const { formState } = useFormContext();

  return (
    <div>
      <Button
        type='submit'
        color={color}
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

export default SubmitButton;
