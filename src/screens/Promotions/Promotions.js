import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../api';
import PromotionsTable from './PromotionsTable/PromotionsTable';
import PromotionsToolbar from './PromotionsToolbar/PromotionsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Promotions() {
  const classes = useStyles();
  const cache = useQueryCache();

  const info = useQuery('promotions', () => api.promotions.getAll(), {
    initialData: () => cache.getQueryData(['promotions']),
  });

  return (
    <div className={classes.root}>
      <PromotionsToolbar />
      <div className={classes.content}>
        <PromotionsTable info={info} />
      </div>
    </div>
  );
}

export default Promotions;
