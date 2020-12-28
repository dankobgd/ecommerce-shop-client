import React from 'react';

import { makeStyles } from '@material-ui/styles';

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

  return (
    <div className={classes.root}>
      <TagsToolbar />
      <div className={classes.content}>
        <TagsTable />
      </div>
    </div>
  );
}

export default Tags;
