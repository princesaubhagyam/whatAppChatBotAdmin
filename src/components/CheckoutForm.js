import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button, Card, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from 'src/api/axiosClient';

const CheckoutForm = ({ isHandleClose, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded
    }

    setLoading(true);

    try {
      // Confirm the payment with Stripe
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
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment successful');
        const stripeTransactionId = result.paymentIntent.id;

        
        try {
          const response = await apiClient.post('/add_money_wallet/', {
            amount: amount,
            stripe_transaction_id: stripeTransactionId,
          });

          console.log('Wallet updated successfully', response.data);

          navigate('/payment-success');
        } catch (apiError) {
          console.log('Failed to update wallet', apiError);
          
        }
      } else {
        console.log('Payment not completed');
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
    } finally {
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
