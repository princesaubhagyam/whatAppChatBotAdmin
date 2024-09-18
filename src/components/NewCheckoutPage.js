import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_vsltnsvTfY0zaOzlwBNaV3Vg00LJzi7UtL');

const NewCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, amount } = location.state || {};
  // console.log(clientSecret,"clientSecret===new checkout ")

  useEffect(() => {
    if (!clientSecret) {
      navigate('/home', { replace: true });
    }
  }, [clientSecret, navigate]);
  const options = {
    clientSecret: clientSecret,
    //theme: 'stripe',
    // mode: 'payment',

    // amount: 10000, // 100 INR in paise
    // currency: 'inr',
    // description: 'Payment for digital services', // Add this line
    // customer: 'Prach',
  };
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} amount={amount} />
      </Elements>
    );
  }
  return null;
};

export default NewCheckoutPage;
