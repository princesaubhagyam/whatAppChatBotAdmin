import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Button, Typography } from '@mui/material';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_vsltnsvTfY0zaOzlwBNaV3Vg00LJzi7UtL');


const CheckoutForm = ({ isHandleClose }) => {
    return (
        <form>
            <PaymentElement />
            <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx ={{
                    marginTop : "25px",
                    display : "flex",
                    justifyContent : "flex-end"
                }}
            >
                <Button variant="contained" color="primary" sx={{ ml: 2 }}> Pay</Button>
                <Button onClick={isHandleClose} variant="contained" color="error" sx={{ ml: 2 }}>Cancel</Button>
            </Typography>

        </form>
    );
};

export default function NewCheckOutModel({ option, isHandleClose }) {
    const options = {
        // clientSecret: option.client_secret
            mode: "payment",
            amount: parseFloat((option.amount)*100),
            currency: option.currency,
        appearance: {
            theme: "stripe"
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
                isHandleClose={isHandleClose}
            />
        </Elements>
    );
};