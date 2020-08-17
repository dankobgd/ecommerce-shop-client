import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import mockData from './data';
import UsersTable from './UsersTable/UsersTable';
import UsersToolbar from './UsersToolbar/UsersToolbar';

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
