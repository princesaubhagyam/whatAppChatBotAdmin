import React from 'react';
import { Modal, Box, Typography, Button,Dialog } from '@mui/material';
import CustomersTableList from 'src/views/customers/CustomersTableList';
const BroadcastMemberModal = ({ open, handleClose, children }) => {
  const [scroll, setScroll] = React.useState('paper');
  return (
    <Dialog open={open} onClose={handleClose} closeAfterTransition scroll={scroll} fullWidth maxWidth="lg" >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '100%', 
          margin: 'auto',
          //mt: 10,
        }}
      >
        {children}
      </Box>
      <Box  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5, mb: 5 }}>
          <Button variant="contained" color="primary">
            Create
          </Button>
          <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 , mr: 2}}>
            Cancel
          </Button>
        </Box>
        
    </Dialog>
  );
};

export default BroadcastMemberModal;
