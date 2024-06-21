import React from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

const messages = [
  { id: 1, text: 'Messages sent', count: '156582', status: 'Delivered' },
  { id: 2, text: 'Messages delivered', count: '156689', status: 'Unread' },
  { id: 3, text: 'Messages read by', count: '21', status: 'Read' },
  //   { id: 4, text: 'Replied by 1%', count: '16', status: 'Replied' },
];

const message1 = [
  { id: 5, text: 'Amount spent', count: '14', status: 'Check products' },
  { id: 6, text: 'Cost per message delivered', count: '10', status: 'Talk to agent' },
  { id: 7, text: 'Cost per website button click', count: '20', status: 'Click ' },
];

const MessageAnalyticsModal = ({ open, handleClose, customerName, message }) => {
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
          width: '35%',
          margin: 'auto',
          mt: 10,
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
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ backgroundColor: '#B8E7CB' }}>
              <ListItemAvatar>{message.count}</ListItemAvatar>
              <ListItemText primary={message.text} />
            </ListItem>
          ))}
        </List>
        <List>
          {message1.map((message) => (
            <ListItem key={message.id} sx={{ backgroundColor: '#CAD3E9' }}>
              <ListItemAvatar>{message.count}</ListItemAvatar>
              <ListItemText primary={message.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MessageAnalyticsModal;
