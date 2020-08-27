import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { tagGetAll, selectAllTags } from '../../store/tag/tagSlice';
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
  const dispatch = useDispatch();
  const tags = useSelector(selectAllTags);

  React.useEffect(() => {
    dispatch(tagGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <TagsToolbar />
      <div className={classes.content}>
        <TagsTable tags={tags} />
      </div>
    </div>
  );
}

export default Tags;
