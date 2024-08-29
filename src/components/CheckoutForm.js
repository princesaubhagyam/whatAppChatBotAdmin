import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button, Card, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ isHandleClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded
    }

    setLoading(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        console.log(submitError.message);
        setLoading(false);
        return;
      }

      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin, // Temporary URL or null
        },
        redirect: 'if_required',
      });

      if (result.error) {
        console.log(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment successful');
        // Navigate to the success page
        navigate('/payment-success', { state: { payment_status: result.paymentIntent.status } });
      } else {
        console.log('Payment not completed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Full viewport height
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <Card sx={{ width: '50%' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" color={'#1a4d2e'} marginBottom={'12px !important'}>
            Enter your Payment details
          </Typography>
          <PaymentElement />
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              marginTop: '25px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!stripe || loading}
              sx={{ ml: 2 }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
            <Button onClick={isHandleClose} variant="contained" color="error" sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutForm;
