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
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import currencycodejson from 'src/utils/Currency.json';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

  function hideMoneyDetails() {
    setAmount('');
    setAddAmonut(() => false);
  }

  const handleCurrencyCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  async function createPaymentRequest(e) {
    e.preventDefault()
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
          padding: '30px',
          width: '60%',
          height: "60%",
          margin: 'auto',
          mt: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="h1" component="h1" color="#1A4D2E">
            <b>My Wallet</b>
          </Typography>
          <Box>
            <Tooltip title="Close wallet">
              <CancelIcon
                sx={{
                  cursor: "pointer"
                }}
                onClick={handleClose}
              />
            </Tooltip>

          </Box>
        </Box>

        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{ marginTop: '70px', marginBottom: '20px', display: "flex", justifyContent: "space-between" }}
        >
          <Box>Current Balance</Box>
          <Box>:</Box>
          <Box> ₹{walletBalance}</Box>
          {addAmount ? <Tooltip title="Close Add Money Box">
            <CancelIcon
              color='error'
              sx={{
                fontSize: "40px",
                cursor: "pointer"
              }}
              onClick={hideMoneyDetails}
            />
          </Tooltip> : <Tooltip title="Add Money">
            <AddCircleIcon
              color='primary'
              sx={{
                fontSize: "40px",
                cursor: "pointer"
              }}
              onClick={handlAddToggle}
            />
          </Tooltip>}

        </Typography>
        {addAmount ? (
          <>
            <form onSubmit={createPaymentRequest}>
              <Stack container spacing={2}
                sx={{
                  marginTop: "40px"
                }}
              >
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
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'primary.main', // Set the border color
                              borderWidth: '1px', // Set the border width
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main', // Keep the same color on hover
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main', // Optional: Keep the same color on focus
                            },
                          },
                        }}
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
                        variant="outlined"
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '1px',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        {currencycodejson.map((code) => (
                          <MenuItem key={code.symbol} value={code.code}>
                            {code.lable} ({code.symbol})
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'primary.main', // Set the border color
                              borderWidth: '1px', // Set the border width
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main', // Keep the same color on hover
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main', // Optional: Keep the same color on focus
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <LoadingButton
                  // onClick={createPaymentRequest}
                  variant="contained"
                  type='submit'
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Checkout...' : 'Checkout'}
                </LoadingButton>
                {/* <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
                Cancel
              </Button> */}
              </Box>
            </form>
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
