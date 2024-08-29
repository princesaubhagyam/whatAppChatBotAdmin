import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button, Card, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import apiClient from 'src/api/axiosClient';

const CheckoutForm = ({ isHandleClose, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded
    }

    setLoading(true);

    // First, submit the payment form
    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.log(submitError.message);
      setLoading(false);
      return;
    }

    // Now, confirm the payment
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Use this to confirm the payment without redirecting immediately
        return_url: window.location.origin, // Temporary URL or null
      },
      redirect: 'if_required', // Prevent automatic redirection
      // confirmParams: {
      //   return_url: 'https://chatbot.saubhagyam.net/payment-success',
      // },
    });

    if (result.error) {
      console.log(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === 'succeeded') {
      console.log('Payment successful');
      const stripeTransactionId = result.paymentIntent.id;

      try {
        const response = await apiClient.post('/add_money_wallet/', {
          amount: amount,
          stripe_transaction_id: stripeTransactionId,
        });

        console.log('Wallet updated successfully', response.data);
      } catch (apiError) {
        console.log('Failed to update wallet', apiError);
        // Handle the failed wallet update scenario here
      }

      setLoading(false);
    } else {
      console.log('Payment not completed');
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
