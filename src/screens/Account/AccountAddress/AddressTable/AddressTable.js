import React, { useState } from 'react';

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { nanoid } from 'nanoid';

import { useDeleteAddress } from '../../../../hooks/queries/userQueries';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    width: 'auto',
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

function AddressTable({ addresses, handleModalOpen }) {
  const classes = useStyles();
  const deleteAddressMutation = useDeleteAddress();
  const [selectedData, setSelectedData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = event => {
    const selected = event.target.checked ? addresses?.map(x => x.id) : [];
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
    <div className={classes.inner}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                checked={selectedData?.length === addresses?.length}
                color='primary'
                indeterminate={selectedData?.length > 0 && selectedData?.length < addresses?.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Line 1</TableCell>
            <TableCell>Line 2</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses?.length > 0 &&
            addresses?.map(address => (
              <TableRow
                className={classes.tableRow}
                hover
                key={nanoid()}
                selected={selectedData.indexOf(address.id) !== -1}
              >
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedData.indexOf(address.id) !== -1}
                    color='primary'
                    onChange={event => handleSelectOne(event, address.id)}
                    value='true'
                  />
                </TableCell>

                <TableCell>{address.id}</TableCell>
                <TableCell>{address.line1}</TableCell>
                <TableCell>{address.line2 || 'none'}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.country}</TableCell>
                <TableCell>{address.state || 'none'}</TableCell>
                <TableCell>{address.phone || 'none'}</TableCell>
                <TableCell>
                  <Button color='secondary' startIcon={<EditIcon />} onClick={() => handleModalOpen()}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    style={{ color: 'red' }}
                    startIcon={<DeleteIcon style={{ fill: 'red' }} />}
                    onClick={() => handleDialogOpen()}
                  >
                    Delete
                  </Button>
                  <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby='delete address dialog'
                    aria-describedby='deletes the address'
                  >
                    <DialogTitle id='delete address dialog'>Delete Address?</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete the address <strong>{address.name}</strong> ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogClose} color='primary'>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          handleDialogClose();
                          deleteAddressMutation.mutate(address.id);
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
  );
}

export default AddressTable;
