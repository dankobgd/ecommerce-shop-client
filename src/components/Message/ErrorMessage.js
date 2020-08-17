import React from 'react';

import { Paper, Typography } from '@material-ui/core';

function ErrorMessage({ message }) {
  return (
    <Paper bgcolor='error.main'>
      <Typography variant='body1'>{message}</Typography>
    </Paper>
  );
}

export default ErrorMessage;
