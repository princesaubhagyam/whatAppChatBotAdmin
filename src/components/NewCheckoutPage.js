import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_vsltnsvTfY0zaOzlwBNaV3Vg00LJzi7UtL');

const NewCheckoutPage = () => {
  const location = useLocation();
  const { clientSecret } = location.state || {};

  const options = {
    clientSecret: clientSecret,
    //theme: 'stripe',
    // mode: 'payment',
    // amount: 10000, // 100 INR in paise
    // currency: 'inr',
    // description: 'Payment for digital services', // Add this line
    // customer: 'Prach',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default NewCheckoutPage;
