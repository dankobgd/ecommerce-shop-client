import React, { useContext, useState } from 'react';

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useMutation, useQueryCache } from 'react-query';

import api from '../../../api';
import { ToastContext } from '../../../store/toast/toast';
import { calculatePaginationStartEndPosition } from '../../../utils/pagination';

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

const TagsTable = ({ className, info, ...rest }) => {
  const classes = useStyles();
  const { data: tags } = info;

  const toast = useContext(ToastContext);
  const cache = useQueryCache();

  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
    const params = new URLSearchParams({ per_page: tags?.meta?.perPage, page: page + 1 });
    // @TODO: use paginated query...
    // dispatch(tagGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    // @TODO: use paginated query...
    // dispatch(tagGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(tags?.meta?.page, tags?.meta?.perPage);

  const [deleteTag] = useMutation(id => api.tags.delete(id), {
    onMutate: id => {
      cache.cancelQueries('tags');
      const previousValue = cache.getQueryData('tags');
      const filtered = previousValue?.data?.filter(x => x.id !== id);
      const obj = { ...previousValue, data: [...filtered] };
      cache.setQueryData('tags', obj);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Tag deleted');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('tags', previousValue);
      toast.error('Error deleting the tag');
    },
    onSettled: () => {
      cache.invalidateQueries('tags');
    },
  });

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
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
              {tags?.meta &&
                tags.data.length > 0 &&
                tags.data.slice(start, end).map(tag => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
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
                      <Link to={`${tag.id}/${tag.slug}/preview`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<VisibilityIcon />}
                          // onClick={() => dispatch(productSlice.actions.setPreviewId(product.id))}
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`${tag.id}/${tag.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          color='secondary'
                          startIcon={<EditIcon />}
                          // onClick={() => dispatch(tagSlice.actions.setEditId(tag.id))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        color='secondary'
                        style={{ color: 'red' }}
                        startIcon={<DeleteIcon style={{ fill: 'red' }} />}
                        onClick={() => handleDialogOpen()}
                      >
                        Delete
                      </Button>
                      <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        aria-labelledby='delete tag dialog'
                        aria-describedby='deletes the tag'
                      >
                        <DialogTitle id='delete tag dialog'>Delete Tag?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the tag <strong>{tag.name}</strong> ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDialogClose} color='primary'>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              handleDialogClose();
                              await deleteTag(tag.id);
                            }}
                            color='primary'
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
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
            page={tags?.meta?.page - 1 || 0}
            rowsPerPage={tags?.meta?.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default TagsTable;
