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

import DeleteDialog from '../../../../components/TableComponents/DeleteDialog';
import { DeleteButton, PreviewButton } from '../../../../components/TableComponents/TableButtons';
import { useDeleteProductTag, useDeleteProductTags } from '../../../../hooks/queries/productQueries';

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

const ProductTagsTable = ({ productId, tags }) => {
  const classes = useStyles();

  const [deleteItem, setDeleteItem] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const deleteProductTagMutation = useDeleteProductTag();
  const deleteProductTagsMutation = useDeleteProductTags();

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
    const selected = event.target.checked ? tags?.map(x => x.id) : [];
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
              Delete {selectedData.length} tags
            </Button>
          )}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedData?.length === tags?.length}
                      color='primary'
                      indeterminate={selectedData?.length > 0 && selectedData?.length < tags?.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {tags?.map(tag => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={tag.tagId}
                    selected={selectedData.indexOf(tag.tagId) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(tag.tagId) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, tag.tagId)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{tag.tagId}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>{tag.slug}</TableCell>
                    <TableCell>{tag.description}</TableCell>
                    <TableCell>
                      <PreviewButton to={`/tags/${tag.tagId}/${tag.slug}/preview`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(tag);
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
        title='tag'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteProductTagMutation.mutate({ productId, tagId: deleteItem.tagId });
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} tags`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteProductTagsMutation.mutate(
            { productId, ids: selectedData },
            {
              onSuccess: () => setSelectedData([]),
            }
          );
        }}
      />
    </>
  );
};

export default ProductTagsTable;
