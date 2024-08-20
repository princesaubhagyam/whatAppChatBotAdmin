import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const DeleteDialog = ({ open, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} sx={{ height: '40%' }}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Are you sure you want to delete the selected contact(s)?</DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} autoFocus color="error" variant="contained" disabled={loading}>
          {/* Delete */}
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
