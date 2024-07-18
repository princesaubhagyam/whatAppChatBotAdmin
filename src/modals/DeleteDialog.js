import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

const DeleteDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Button color="primary" onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
