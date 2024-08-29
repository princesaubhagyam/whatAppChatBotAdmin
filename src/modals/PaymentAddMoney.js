import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import currencycodejson from 'src/utils/Currency.json';

const PaymentAddMoney = ({ open, setOpenAddWalletModal, walletBalance }) => {
  const [loading, setLoading] = useState(false);
  const [addAmount, setAddAmonut] = useState(false);
  const [currencyCode, setCountryCode] = useState('inr');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate(); // Use useNavigate to handle navigation

  const handleChange = (event) => {
    setAmount(() => event.target.value);
  };

  function handlAddToggle() {
    setAddAmonut(() => true);
  }

  function handleClose() {
    setOpenAddWalletModal(() => false);
    setAddAmonut(() => false);
    setAmount('');
    setCountryCode('inr');
  }

  const handleCurrencyCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  async function createPaymentRequest() {
    setLoading(true);
    const reqBody = {
      amount: amount,
      currency: currencyCode,
      description: description,
    };
    try {
      const response = await apiClient.post('/create_payment/', reqBody);
      if (response.data.status) {
        const { client_secret } = response.data;
        setLoading(false);

        // Navigate to the payment page with the client_secret
        navigate('/payment', { state: { clientSecret: client_secret, amount } });
      }
    } catch (error) {
      console.error('Error creating payment request:', error);
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-contact-modal"
      aria-describedby="add-contact-form"
    >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: '20px',
          width: '28%',
          margin: 'auto',
          mt: 10,
        }}
      >
        <Typography variant="h4" component="h1" color="#1A4D2E">
          My Wallet
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ marginTop: '20px', marginBottom: '20px' }}
        >
          Wallet Balance : ₹{walletBalance}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ marginTop: '20px' }}>
          Add Balance In Wallet
          {addAmount ? null : (
            <Button variant="contained" sx={{ marginLeft: '15px' }} onClick={handlAddToggle}>
              Add
            </Button>
          )}
        </Typography>
        {addAmount ? (
          <>
            <Stack container spacing={2}>
              <FormControl fullWidth>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      value={amount}
                      onChange={handleChange}
                      placeholder="Enter The Amount"
                      type="number"
                      InputProps={{
                        inputProps: { min: 0 },
                        sx: {
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                            '-webkit-appearance': 'none',
                            appearance: 'textfield',
                          },
                          '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                          },
                          '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item md={6} lg={6} xs={12}>
                    <Select
                      value={currencyCode}
                      onChange={handleCurrencyCodeChange}
                      sx={{ width: 'auto', minWidth: '165px' }}
                    >
                      {currencycodejson.map((code) => (
                        <MenuItem key={code.symbol} value={code.code}>
                          {code.code} ({code.symbol})
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter Description"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <LoadingButton
                onClick={createPaymentRequest}
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Checkout...' : 'Checkout'}
              </LoadingButton>
              <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </>
        ) : null}
      </Box>
    </Modal>
  );
};

PaymentAddMoney.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default PaymentAddMoney;
