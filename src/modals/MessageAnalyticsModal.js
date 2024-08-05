import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
} from '@mui/material';
import apiClient from 'src/api/axiosClient';

const MessageAnalyticsModal = ({ id, open, handleClose, customerName, message }) => {
  const [broadcastData, setBroadcastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBroadcastData = async () => {
      try {
        const response = await apiClient.get(`/broadcast-history/${id}/`);
        setBroadcastData(response.data.data);
        console.log('modal', response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (open) {
      fetchBroadcastData();
    }
  }, [open]);

  if (loading) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="message-analytics-modal"
        aria-describedby="message-analytics-description"
      >
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
          <Typography variant="h5" component="h2" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="message-analytics-modal"
        aria-describedby="message-analytics-description"
      >
        <Box
          sx={{
            outline: 'none',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '400px',
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            No Data Found
          </Typography>
          {/* <Typography variant="body2" gutterBottom>
            {error.message}
          </Typography> */}
        </Box>
      </Modal>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="message-analytics-modal"
      aria-describedby="message-analytics-description"
    >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,

          margin: 'auto',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Message Analytics
        </Typography>
        <List>
          <ListItem sx={{ backgroundColor: '#E9FEEE' }}>
            <Typography variant="h5" sx={{ fontSize: '0.85rem', color: 'rgb(26, 77, 46)' }}>
              {customerName}
            </Typography>
          </ListItem>
          <ListItem sx={{ backgroundColor: '#E9FEEE' }}>
            <Typography variant="body2" gutterBottom>
              {message}
            </Typography>
          </ListItem>
        </List>
        {broadcastData && (
          <>
            <Typography variant="h6" gutterBottom>
              Broadcast Name: {broadcastData.broadcast.broadcast_name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Members: {broadcastData.broadcast.total_members}
            </Typography>
            {broadcastData.broadcast_histories.map((history, index) => (
              <List key={index}>
                <Typography variant="h6" gutterBottom>
                  Template: {history.template}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {history.template_body}
                </Typography>
                {history.message_statuses.map((status, idx) => (
                  <ListItem key={idx} sx={{ backgroundColor: '#B8E7CB' }}>
                    <ListItemAvatar>{status.count}</ListItemAvatar>
                    <ListItemText primary={status.status} secondary={`${status.percentage}`} />
                  </ListItem>
                ))}
              </List>
            ))}
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MessageAnalyticsModal;
