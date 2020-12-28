import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function DeleteDialog({ title, item, dialogOpen, handleDialogClose, onClick }) {
  const uppercase = title.toLowerCase().charAt(0).toUpperCase() + title.slice(1);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      aria-labelledby={`delete ${title} dialog`}
      aria-describedby={`deletes the ${title}`}
    >
      <DialogTitle id={`delete the ${title} dialog`}>Delete {uppercase}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the {title} {item && <strong>"{item}"</strong>} ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onClick} color='primary' autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
