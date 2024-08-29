import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import img from 'src/assets/images/backgrounds/success_payment.png';
import { useNavigate } from 'react-router';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Full viewport height
        textAlign: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={img}
        alt="Success Payment"
        style={{
          maxWidth: '100%',
          height: '100px',
          marginBottom: '16px', // Space between image and text
        }}
      />
      <Typography variant="h3">Payment Done Successfully</Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome} sx={{ marginTop: '16px' }}>
        Go back to home
      </Button>
    </Box>
  );
}

export default PaymentSuccessPage;