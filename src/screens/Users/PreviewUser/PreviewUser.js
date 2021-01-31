import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useUser } from '../../../hooks/queries/userQueries';
import { formatDate } from '../../../utils/formatDate';
import PreviewToolbar from './PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewUser({ userId }) {
  const classes = useStyles();
  const { data: user } = useUser(userId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={user?.id} />
            <PreviewItem title='First Name' value={user?.firstName} />
            <PreviewItem title='Last Name' value={user?.lastName} />
            <PreviewItem title='Username' value={user?.username} />
            <PreviewItem title='Email' value={user?.email} />
            <PreviewItem title='Gender' value={user?.gender} />
            <PreviewItem title='Role' value={user?.role} />
            <PreviewItem title='Locale' value={user?.locale} />
            <PreviewItem title='Avatar URL' value={user?.avatarUrl} />
            <PreviewItem title='Avatar Public ID' value={user?.avatarPublicId} />
            <PreviewItem title='Active' value={user?.active ? 'Yes' : 'No'} />
            <PreviewItem title='Email Verified' value={user?.emailVerified ? 'Yes' : 'No'} />
            <PreviewItem title='Last Login At' value={formatDate(user?.lastLoginAt)} />
            <PreviewItem title='Created At' value={formatDate(user?.createdAt)} />
            <PreviewItem title='Updated At' value={formatDate(user?.updatedAt)} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewUser;
