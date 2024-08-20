import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Fade, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport, IconDownload } from '@tabler/icons';
import apiClient from 'src/api/axiosClient';
import toast, { Toaster } from 'react-hot-toast';

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

const ImportContactModal = ({ open, handleClose, getApiData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
    }
  }, [open]);

  const sampleFileUrl =
    'https://saubhagyam503.pythonanywhere.com/static/import_samples/contacts.csv';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log('abc', formData);
      try {
        setLoading(true);
        await apiClient.post('/import-contacts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('File uploaded successfully');
        handleClose();
        getApiData();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to upload file');
        }
      } finally {
        setLoading(false);
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
            Choose file to import contact
          </Typography>
          <Button
            component="a"
            href={sampleFileUrl}
            download="contacts.csv"
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
          <Box sx={{ border: 2, borderColor: '#1A4D2E', py: 0, mt: 2 }} variant="contained">
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
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
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleSubmit}
              loading={loading}
              disabled={loading} 
              loadingPosition="start"
              loadingIndicator={
                <React.Fragment>
                  <CircularProgress size={18} color="inherit" />
                  {/* Creating.. */}
                </React.Fragment>
              }
            >
               {loading ? <>Loading...</> :<>Import</> }
             
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImportContactModal;
