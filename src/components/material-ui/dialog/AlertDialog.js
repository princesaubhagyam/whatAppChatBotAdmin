import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

const DeleteDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Delete
          </Button>
          <Button color="primary" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
