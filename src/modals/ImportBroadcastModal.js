import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Fade,
  Typography,
  FormControl,
  InputLabel,
  Input,
  OutlinedInput,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport, IconDownload } from '@tabler/icons';

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

const ImportBroadcastModal = ({ open, handleClose }) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const sampleFileUrl =
    'https://saubhagyam503.pythonanywhere.com/static/import_samples/broadcast.csv';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!broadcastTitle) tempErrors.broadcastTitle = 'Broadcast title is required';
    if (!file) tempErrors.file = 'File is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = () => {
    if (validateFields()) {
      // Proceed with creating the broadcast
      console.log('Broadcast Created');
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
          {/* <FormControl sx={{ marginTop: '10px', width: '100%' }}>
            <InputLabel htmlFor="component-outlined">Enter Broadcast Title</InputLabel>
            <OutlinedInput
              id="broadcast-title"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              error={!!errors.broadcastTitle}
            />
            {errors.broadcastTitle && (
              <Typography color="error">{errors.broadcastTitle}</Typography>
            )}
          </FormControl> */}
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
            <OutlinedInput  label="Enter Broadcast Title" id="broadcast-title"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              error={!!errors.broadcastTitle}/>
          </FormControl>
          {errors.broadcastTitle && (
              <Typography color="error">{errors.broadcastTitle}</Typography>
            )}
          
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
            {errors.file && <Typography color="error">{errors.file}</Typography>}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleCreate}>
              Create
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

export default ImportBroadcastModal;
