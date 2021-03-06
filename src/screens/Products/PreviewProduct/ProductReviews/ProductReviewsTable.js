import React, { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import { nanoid } from 'nanoid';

import DeleteDialog from '../../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../../components/TableComponents/TableButtons';
import { useDeleteProductReview, useDeleteProductReviews } from '../../../../hooks/queries/productQueries';
import { truncateText } from '../../../../utils/truncateText';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    overflowX: 'auto',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

const ProductReviewsTable = ({ reviews, product }) => {
  const classes = useStyles();

  const [deleteItem, setDeleteItem] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const deleteProductReviewMutation = useDeleteProductReview();
  const deleteProductReviewsMutation = useDeleteProductReviews({
    onSuccess: () => setSelectedData([]),
  });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBulkDeleteDialogOpen = () => {
    setBulkDeleteDialogOpen(true);
  };
  const handleBulkDeleteDialogClose = () => {
    setBulkDeleteDialogOpen(false);
  };

  const handleSelectAll = event => {
    const selected = event.target.checked ? reviews?.map(x => x.id) : [];
    setSelectedData(selected);
  };
  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedData.indexOf(id);
    let newSelectedData = [];

    if (selectedIndex === -1) {
      newSelectedData = newSelectedData.concat(selectedData, id);
    } else if (selectedIndex === 0) {
      newSelectedData = newSelectedData.concat(selectedData.slice(1));
    } else if (selectedIndex === selectedData.length - 1) {
      newSelectedData = newSelectedData.concat(selectedData.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedData = newSelectedData.concat(
        selectedData.slice(0, selectedIndex),
        selectedData.slice(selectedIndex + 1)
      );
    }

    setSelectedData(newSelectedData);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          {selectedData?.length > 0 && (
            <Button
              size='small'
              variant='contained'
              style={{ backgroundColor: '#dc004e', color: '#fff', margin: '1rem' }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                handleBulkDeleteDialogOpen();
              }}
            >
              Delete {selectedData.length} reviews
            </Button>
          )}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedData?.length === reviews?.length}
                      color='primary'
                      indeterminate={selectedData?.length > 0 && selectedData?.length < reviews?.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews?.length > 0 &&
                  reviews?.map(review => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={nanoid()}
                      selected={selectedData.indexOf(review.id) !== -1}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={selectedData.indexOf(review.id) !== -1}
                          color='primary'
                          onChange={event => handleSelectOne(event, review.id)}
                          value='true'
                        />
                      </TableCell>
                      <TableCell>{review?.id}</TableCell>
                      <TableCell>{review?.rating}</TableCell>
                      <TableCell>{review?.title}</TableCell>
                      <TableCell>{truncateText(review?.comment, 50)}</TableCell>
                      <TableCell>
                        <PreviewButton to={`/products/${product?.id}/${product?.slug}/reviews/${review?.id}/preview`} />
                      </TableCell>
                      <TableCell>
                        <EditButton to={`/products/${product?.id}/${product?.slug}/reviews/${review?.id}/edit`} />
                      </TableCell>
                      <TableCell>
                        <DeleteButton
                          onClick={() => {
                            setDeleteItem(review);
                            handleDialogOpen();
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        title='review'
        item={deleteItem?.id}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteProductReviewMutation.mutate({ productId: product?.id?.toString(), reviewId: deleteItem.id });
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} reviews`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteProductReviewsMutation.mutate({ productId: product?.id?.toString(), ids: selectedData });
        }}
      />
    </>
  );
};

export default ProductReviewsTable;
