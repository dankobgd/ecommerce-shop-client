import React from 'react';

import { Fab, Tooltip, Typography } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/styles';

import ScrollTop from './ScrollTop';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function ScrollTopButton() {
  return (
    <ScrollTop>
      <CustomTooltip title={<Typography color='inherit'>Scroll To Top</Typography>}>
        <Fab color='primary' variant='round' size='medium'>
          <ArrowUpwardIcon />
        </Fab>
      </CustomTooltip>
    </ScrollTop>
  );
}

export default ScrollTopButton;
