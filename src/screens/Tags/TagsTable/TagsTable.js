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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';

import tagSlice, { tagDelete, tagGetAll, selectPaginationMeta } from '../../../store/tag/tagSlice';
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

const TagsTable = props => {
  const { className, tags, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const paginationMeta = useSelector(selectPaginationMeta);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = event => {
    let selected;

    if (event.target.checked) {
      selected = tags.map(tag => tag.id);
    } else {
      selected = [];
    }

    setSelectedTags(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTags.indexOf(id);
    let newSelectedTags = [];

    if (selectedIndex === -1) {
      newSelectedTags = newSelectedTags.concat(selectedTags, id);
    } else if (selectedIndex === 0) {
      newSelectedTags = newSelectedTags.concat(selectedTags.slice(1));
    } else if (selectedIndex === selectedTags.length - 1) {
      newSelectedTags = newSelectedTags.concat(selectedTags.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTags = newSelectedTags.concat(
        selectedTags.slice(0, selectedIndex),
        selectedTags.slice(selectedIndex + 1)
      );
    }

    setSelectedTags(newSelectedTags);
  };

  const handlePageChange = (e, page) => {
    const params = new URLSearchParams({ per_page: paginationMeta.perPage, page: page + 1 });
    dispatch(tagGetAll(`${params}`));
  };

  const handleRowsPerPageChange = e => {
    const params = new URLSearchParams({ per_page: e.target.value });
    dispatch(tagGetAll(`${params}`));
  };

  const { start, end } = calculatePaginationStartEndPosition(paginationMeta?.page, paginationMeta?.perPage);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedTags.length === tags.length}
                    color='primary'
                    indeterminate={selectedTags.length > 0 && selectedTags.length < tags.length}
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
              {paginationMeta &&
                tags.length > 0 &&
                tags.slice(start, end).map(tag => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={nanoid()}
                    selected={selectedTags.indexOf(tag.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedTags.indexOf(tag.id) !== -1}
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
                      <Link to={`${tag.id}/${tag.slug}/edit`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outlined'
                          color='secondary'
                          startIcon={<EditIcon />}
                          onClick={() => dispatch(tagSlice.actions.setEditId(tag.id))}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<DeleteIcon />}
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
                            onClick={() => {
                              handleDialogClose();
                              dispatch(tagDelete(tag.id));
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
        {paginationMeta && (
          <TablePagination
            component='div'
            count={paginationMeta.totalCount || -1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={paginationMeta.page - 1 || 0}
            rowsPerPage={paginationMeta.perPage || 50}
            rowsPerPageOptions={[10, 25, 50, 75, 120]}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default TagsTable;
