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
  const [loading, setLoading] = useState(false); // State to manage loading state of create button

  useEffect(() => {
    // Reset state when modal opens
    if (open === true) {
      setBroadcastTitle('');
      setFile(null);
      setFileName('');
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
    if (!file) tempErrors.file = 'File is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateFields()) {
      setLoading(true); // Start loading state
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', broadcastTitle);

      try {
        const response = await apiClient.post('/broadcast/create/excel/csv/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('File uploaded successfully');
        handleClose();
        getBroadcastsData();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to upload file');
        }
      } finally {
        setLoading(false); // Stop loading state
      }
    } else {
      toast.error('Please select a file first');
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
            width: '30%',
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" component="h2">
            Create Broadcast from CSV
          </Typography>
          <Button
            href={sampleFileUrl}
            download="broadcast.csv"
            sx={{
              backgroundColor: 'transparent',
              width: '100%',
              fontWeight: '600',
              fontSize: '0.95rem',
              marginTop: '10px',
              '&:hover': {
                backgroundColor: `white`,
                color: 'green',
              },
            }}
          >
            <IconDownload size={'20'} />
            Download Sample CSV
          </Button>
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

          <Box sx={{ border: 2, borderColor: '#1A4D2E', py: 0, mt: 2 }} variant="contained">
            <Button
              component="label"
              role={undefined}
              startIcon={<IconFileImport />}
              fullWidth
              style={{
                padding: '16px',
                fontSize: '1rem',
                borderRadius: '4px',
              }}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </Box>
          {fileName && <Typography sx={{ mt: 1 }}> Selected file: {fileName}</Typography>}
          {errors.file && <Typography color="error">{errors.file}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={loading}
              onClick={handleCreate}
              sx={{ mr: 2 }}
              loadingPosition="start"
              loadingIndicator={
                <React.Fragment>
                  <CircularProgress size={18} color="inherit" />
                  {/* Creating.. */}
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
