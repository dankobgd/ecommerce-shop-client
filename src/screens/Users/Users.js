import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import UsersToolbar from './UsersToolbar/UsersToolbar';
import UsersTable from './UsersTable/UsersTable';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const UserList = () => {
  const classes = useStyles();

  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UserList;
