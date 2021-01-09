import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useTag } from '../../../hooks/queries/tagQueries';
import PreviewToolbar from '../TagsToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewTag({ tagId }) {
  const classes = useStyles();

  const { data: tag } = useTag(tagId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={tag?.id} />
            <PreviewItem title='Name' value={tag?.name} />
            <PreviewItem title='Slug' value={tag?.slug} />
            <PreviewItem title='Description' value={tag?.description} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewTag;
