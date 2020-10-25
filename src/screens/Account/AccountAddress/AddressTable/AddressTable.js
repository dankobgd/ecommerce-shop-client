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
import { useDispatch } from 'react-redux';

import userSlice, { deleteAddress } from '../../../../store/user/userSlice';

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

function AddressTable(props) {
  const { addresses, handleModalOpen } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedAddresses, setSelectedAddresses] = useState([]);
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
      selected = addresses.map(address => address.id);
    } else {
      selected = [];
    }

    setSelectedAddresses(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedAddresses.indexOf(id);
    let newSelectedAddresses = [];

    if (selectedIndex === -1) {
      newSelectedAddresses = newSelectedAddresses.concat(selectedAddresses, id);
    } else if (selectedIndex === 0) {
      newSelectedAddresses = newSelectedAddresses.concat(selectedAddresses.slice(1));
    } else if (selectedIndex === selectedAddresses.length - 1) {
      newSelectedAddresses = newSelectedAddresses.concat(selectedAddresses.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAddresses = newSelectedAddresses.concat(
        selectedAddresses.slice(0, selectedIndex),
        selectedAddresses.slice(selectedIndex + 1)
      );
    }

    setSelectedAddresses(newSelectedAddresses);
  };

  return (
    <div className={classes.inner}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                checked={selectedAddresses.length === addresses.length}
                color='primary'
                indeterminate={selectedAddresses.length > 0 && selectedAddresses.length < addresses.length}
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
          {addresses.map(address => (
            <TableRow
              className={classes.tableRow}
              hover
              key={nanoid()}
              selected={selectedAddresses.indexOf(address.id) !== -1}
            >
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={selectedAddresses.indexOf(address.id) !== -1}
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
                <Button
                  variant='outlined'
                  color='secondary'
                  startIcon={<EditIcon />}
                  onClick={() => {
                    dispatch(userSlice.actions.setEditAddressId(address.id));
                    handleModalOpen();
                  }}
                >
                  Edit
                </Button>
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
                        dispatch(deleteAddress(address.id));
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
