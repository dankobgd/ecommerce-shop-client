import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../api';
import TagsTable from './TagsTable/TagsTable';
import TagsToolbar from './TagsToolbar/TagsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Tags() {
  const classes = useStyles();
  const cache = useQueryCache();

  const info = useQuery('tags', () => api.tags.getAll(), {
    initialData: () => cache.getQueryData(['tags']),
  });

  return (
    <div className={classes.root}>
      <TagsToolbar />
      <div className={classes.content}>
        <TagsTable info={info} />
      </div>
    </div>
  );
}

export default Tags;
