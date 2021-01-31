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
  Chip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import DeleteDialog from '../../../components/TableComponents/DeleteDialog';
import { DeleteButton, EditButton, PreviewButton } from '../../../components/TableComponents/TableButtons';
import { useDeleteUser, useDeleteUsers, useUsers } from '../../../hooks/queries/userQueries';
import { diff } from '../../../utils/diff';
import { formatDate } from '../../../utils/formatDate';
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

const UsersTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pageMeta, setPageMeta] = useState(getPersistedPagination('users'));
  const { data: users } = useUsers(pageMeta, { keepPreviousData: true });

  const [deleteItem, setDeleteItem] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const deleteUserMutation = useDeleteUser();
  const deleteUsersMutation = useDeleteUsers({
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
    const selected = event.target.checked ? users?.data?.map(x => x.id) : [];
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
    const params = { page: page + 1, per_page: users?.meta?.perPage };
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
    persistPagination('users', pageMeta);
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
              Delete {selectedData.length} users
            </Button>
          )}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedData?.length === users?.data?.length}
                      color='primary'
                      indeterminate={selectedData?.length > 0 && selectedData?.length < users?.data?.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Locale</TableCell>
                  <TableCell>Avatar URL</TableCell>
                  <TableCell>Avatar Public ID</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Email Verified</TableCell>
                  <TableCell>Last Login At</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.data?.map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    selected={selectedData.indexOf(user.id) !== -1}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedData.indexOf(user.id) !== -1}
                        color='primary'
                        onChange={event => handleSelectOne(event, user.id)}
                        value='true'
                      />
                    </TableCell>
                    <TableCell>{user?.id}</TableCell>
                    <TableCell>{user?.firstName}</TableCell>
                    <TableCell>{user?.lastName}</TableCell>
                    <TableCell>{user?.username}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>
                      {user?.gender && (
                        <Chip
                          label={user?.gender}
                          style={{ color: '#fff', backgroundColor: user?.gender === 'm' ? '#22223b' : 'hotpink' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user?.role}
                        style={{ color: '#fff', backgroundColor: user?.role === 'admin' ? 'goldenrod' : '#5b5bd6' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={user?.locale} />
                    </TableCell>
                    <TableCell>{user?.avatarUrl}</TableCell>
                    <TableCell>{user?.avatarPublicId}</TableCell>
                    <TableCell>
                      <Chip
                        label={user?.active ? 'Yes' : 'No'}
                        style={{ backgroundColor: user?.active ? 'green' : '#9a2424', color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user?.emailVerified ? 'Yes' : 'No'}
                        style={{ backgroundColor: user?.emailVerified ? 'green' : '#9a2424', color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user?.lastLoginAt)}</TableCell>
                    <TableCell>{formatDate(user?.createdAt)}</TableCell>
                    <TableCell>{formatDate(user?.updatedAt)}</TableCell>
                    <TableCell>
                      <PreviewButton to={`${user.id}/${user.username}/preview`} />
                    </TableCell>
                    <TableCell>
                      <EditButton to={`${user.id}/${user.username}/edit`} />
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        onClick={() => {
                          setDeleteItem(user);
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
          {users?.meta && (
            <TablePagination
              component='div'
              count={users?.meta?.totalCount || -1}
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
        title='user'
        item={deleteItem?.name}
        handleDialogClose={handleDialogClose}
        dialogOpen={dialogOpen}
        onClick={() => {
          handleDialogClose();
          deleteUserMutation.mutate(deleteItem.id);
        }}
      />

      <DeleteDialog
        title={`${selectedData.length} users`}
        handleDialogClose={handleBulkDeleteDialogClose}
        dialogOpen={bulkDeleteDialogOpen}
        onClick={() => {
          handleBulkDeleteDialogClose();
          deleteUsersMutation.mutate(selectedData);
        }}
      />
    </>
  );
};

export default UsersTable;
