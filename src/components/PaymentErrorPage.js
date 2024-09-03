import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import img from 'src/assets/images/backgrounds/failed.jpg';
import { useNavigate, useLocation } from 'react-router';

function PaymentErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payment_error } = location.state || {};

  React.useEffect(() => {
    if (!payment_error) {
      navigate('/home',{replace :true});
    }
  }, [payment_error, navigate]);
  const handleGoHome = () => {
    navigate('/home',{replace :true});
  };
  if (payment_error) {
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
        <Typography variant="h3">Payment was Unsuccessful</Typography>
        {payment_error.message && (
          <Typography
            variant="body1"
            color="error"
            sx={{ marginTop: '16px' }}
            fontWeight={500}
            fontSize={'medium'}
          >
            {payment_error.message}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ marginTop: '16px' }}
        >
          Go back to home
        </Button>
      </Box>
    );
  }
  return null;
}

export default PaymentErrorPage;
