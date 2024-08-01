import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Fade,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport, IconDownload } from '@tabler/icons';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImportBroadcastModal = ({ open, handleClose, getBroadcastsData }) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open === true) {
      setBroadcastTitle('');
      setErrors({});
    }
  }, [open]);

  const sampleFileUrl =
    'https://saubhagyam503.pythonanywhere.com/static/import_samples/broadcast.csv';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!broadcastTitle) tempErrors.broadcastTitle = 'Broadcast title is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateFields()) {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', broadcastTitle);

      try {
        const response = await apiClient.post('api/broadcasts/', formData);
        toast.success('Broadcast created successfully');
        handleClose();
        getBroadcastsData();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(JSON.stringify(error.response.data.message));
        } else {
          toast.error('Failed to upload file');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            outline: 'none',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '35%',
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" component="h2">
          Create Broadcast Title
          </Typography>
          <FormControl sx={{ marginTop: '15px', width: '100%' }}>
            <InputLabel htmlFor="component-outlined">Enter Broadcast Title</InputLabel>
            <OutlinedInput
              label="Enter Broadcast Title"
              id="broadcast-title"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              error={!!errors.broadcastTitle}
            />
          </FormControl>
          {errors.broadcastTitle && <Typography color="error">{errors.broadcastTitle}</Typography>}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={loading}
              onClick={handleCreate}
              sx={{ mr: 2 }}
              //loadingPosition="start"
              loadingIndicator={
                <React.Fragment>
                  <CircularProgress size={18} color="inherit" />
                </React.Fragment>
              }
            >
              Create
            </LoadingButton>
            <Button variant="contained" color="error" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImportBroadcastModal;
