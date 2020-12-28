import React from 'react';

import { Fab, Typography } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import CustomTooltip from '../CustomTooltip/CustomTooltip';
import ScrollTop from './ScrollTop';

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
