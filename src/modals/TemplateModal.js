import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Fade,
  TextareaAutosize,
  Select,
  MenuItem,
  FormLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport } from '@tabler/icons';
import axiosClientBm from 'src/api/axiosClientBm';
import apiClient from 'src/api/axiosClient';

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

const TemplateModal = ({ open, handleClose, broadcastId }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
    // body_message: '',
  });

  const fetchTemplates = async () => {
    try {
      const res = await axiosClientBm.get('message_templates/');
      if (res.status === 200) {
        setTemplates(res.data.data);
      }
    } catch (err) {
      console.warn(err, '++++++++++++++++++');
    }
  };

  React.useEffect(() => {
    fetchTemplates();
    setBroadcastDetails({
      broadcast: broadcastId,
      template: null,
      body_message: '',
    });
  }, [broadcastId]);

  const handleFieldChange = (e) => {
    setBroadcastDetails({
      ...broadcastDetails,
      broadcast: broadcastId,
      [e.target.name]: e.target.value,
    });
  };

  const sendBroadcastMsg = async () => {
    setLoading(true);
    if (!broadcastDetails.template) {
      alert('Please select template!');
      return;
    }
    // if (!broadcastDetails.body_message) {
    //   alert('PLease enter message text!');
    //   return;
    // }
    try {
      const res = await apiClient.post('/api/send_template/', { ...broadcastDetails });
      if (res.status === 200 || res.status === 201) {
        alert('Broadcast scheduled succesfully!');
        handleClose();
      }
    } catch (err) {
      console.warn(err);
      alert(err?.response?.data?.message ?? 'There was an error! Please try again!');
    } finally {
      setLoading(false);
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
          <FormLabel>Select template</FormLabel>
          <Select
            value={broadcastDetails.template}
            fullWidth
            displayEmpty
            name="template"
            onChange={handleFieldChange}
          >
            {templates?.map((temp) => (
              <MenuItem value={temp.name}>{temp.name}</MenuItem>
            ))}
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
          {/* <Box sx={{ border: 2, borderColor: '#1A4D2E', py: 0, mt: 2 }} variant="contained">
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
              <VisuallyHiddenInput type="file" />
            </Button>
          </Box> */}
          {/* <TextareaAutosize
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px',
              borderRadius: '5px',
              borderColor: 'lightgray',
            }}
            minRows={5}
            placeholder="Enter text here..."
            name="body_message"
            onChange={handleFieldChange}
          /> */}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={sendBroadcastMsg}>
              Send
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

export default TemplateModal;
