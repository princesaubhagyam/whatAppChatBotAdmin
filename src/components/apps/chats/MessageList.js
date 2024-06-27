import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { IconChartBar } from '@tabler/icons';
import MessageAnalyticsModal from 'src/modals/MessageAnalyticsModal';

const MessageList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleChartClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#E9FEEE',
        borderRadius: 1,
        position: 'absolute',
        bottom: '8rem',
        right: '1rem',
        padding: 1,
        boxShadow: '0px 1px 110px #00000025',
      }}
    >
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h5" sx={{ fontSize: '0.85rem', color: 'rgb(26, 77, 46)' }}>
          Amar Sharma
        </Typography>
        <Button onClick={handleChartClick} cursor="pointer">
          <IconChartBar size={20} />
        </Button>
      </Stack>
      <Typography sx={{ fontSize: '0.81rem' }}>Hii Customer name</Typography>
      <Typography sx={{ fontSize: '0.81rem' }}>
        We have exciting new arrivals.
        <br />
        Would you like to see them?
      </Typography>
      
      <MessageAnalyticsModal
        open={showModal}
        handleClose={handleCloseModal}
        customerName="Amar Sharma"
        message="We have exciting new arrivals. Would you like to see them?"
      />
    </Box>
  );
};

export default MessageList;
