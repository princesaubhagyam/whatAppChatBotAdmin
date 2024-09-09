import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Fade, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport, IconDownload } from '@tabler/icons';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import {fetchSelectedBroadcasts } from 'src/store/apps/chat/ChatSlice';
import {  useDispatch } from 'react-redux';

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
export const getBroadcastsData = async () => {
  try {
    const response = await apiClient.get('/api/broadcasts/');
    return response.data.data.results;
  } catch (error) {
    toast.error('Error fetching data from API:', error);
  }
};
const ImportBroadcastMember = ({
  open,
  handleClose,
  activeBroadcastId,

  getBroadcastList = () => {},
}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(activeBroadcastId,"activeBroadcastId===")

  // const getBroadcastList = async () => {
  //   const broadcastsRes = await getBroadcastsData();
  //   // setBroadcasts(broadcastsRes);
  //   dispatch(setBroadcastList(broadcastsRes));
  // };
  useEffect(() => {
    if (open) {
      setFile(null);
      setFileName('');
      setErrors({});
    }
  }, [open]);

  const sampleFileUrl =
    'https://saubhagyam503.pythonanywhere.com/static/import_samples/contacts_import.csv';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const validateFields = () => {
    const tempErrors = {};
    if (!file) tempErrors.file = 'File is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateFields()) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('broad_id', activeBroadcastId);

      try {
        const response = await apiClient.post('add_broad_members', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          toast.success('File uploaded successfully');
          handleClose();

          getBroadcastList();
          // getMemberListInGroup();
          dispatch(fetchSelectedBroadcasts(activeBroadcastId))
        }
      } catch (error) {
        console.log(error, '----');
        toast.error(error?.response?.data?.message ?? 'There was an error!');
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
            width: '30%',
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" component="h2">
            Add Member from CSV
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
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
              sx={{ mr: 2 }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImportBroadcastMember;
