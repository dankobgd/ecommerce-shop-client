import React from 'react';

import { Typography } from '@material-ui/core';

function PreviewItem({ title, value, style }) {
  return (
    <div style={{ marginTop: '1rem', ...style }}>
      <Typography variant='subtitle2' color='textSecondary' gutterBottom>
        {title}
      </Typography>
      <Typography variant='h5' color='textPrimary' gutterBottom>
        {value}
      </Typography>
    </div>
  );
}

export default PreviewItem;
