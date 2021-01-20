import React, { useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useDeleteTag, useDeleteTags, useTags } from '../../../hooks/queries/tagQueries';
import { diff } from '../../../utils/diff';
import { persistPagination, getPersistedPagination, paginationRanges } from '../../../utils/pagination';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
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

const TagsTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('tags'));
  const { data: tags } = useTags(pageMeta, { keepPreviousData: true });
  const deleteTagMutation = useDeleteTag();
  const deleteTagsMutation = useDeleteTags();

  const [deleteItem, setDeleteItem] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

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
    const selected = event.target.checked ? tags?.data?.map(x => x.id) : [];
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

  const handlePageChange = (e, page) => {
    const params = { page: page + 1, per_page: tags?.meta?.perPage };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  const handleRowsPerPageChange = e => {
    const params = { page: 1, per_page: e.target.value };
    if (Object.keys(diff(pageMeta, params).length > 0)) {
      setPageMeta(meta => ({ ...meta, ...params }));
    }
  };

  React.useEffect(() => {
    persistPagination('tags', pageMeta);
  }, [pageMeta]);

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
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
                      checked={selectedData?.length === tags?.data?.length}
                      color='primary'
                      indeterminate={selectedData?.length > 0 && selectedData?.length < tags?.data?.length}
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
                {tags?.data?.map(tag => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={tag.id}
                    selected={selectedData.indexOf(tag.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(tag.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, tag.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>{tag.slug}</TableCell>
                    <TableCell>{tag.description}</TableCell>
                    <TableCell>
                      <PreviewButton to={`${tag.id}/${tag.slug}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${tag.id}/${tag.slug}/edit`} />
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
        <CardActions className={classes.actions}>
          {tags?.meta && (
            <TablePagination
              component='div'
              count={tags?.meta?.totalCount || -1}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={pageMeta.page - 1}
              rowsPerPage={pageMeta?.per_page}
              rowsPerPageOptions={paginationRanges}
            />
          )}
        </CardActions>
      </Card>

      <DeleteDialog
        title='tag'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteTagMutation.mutate(deleteItem.id);
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} tags`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteTagsMutation.mutate(selectedData, {
            onSuccess: () => setSelectedData([]),
          });
        }}
      />
    </>
  );
};

export default TagsTable;
