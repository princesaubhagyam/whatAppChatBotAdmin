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
import apiClient from 'src/api/axiosClient';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import currencycodejson from 'src/utils/Currency.json';
import NewCheckOutModel from "src/modals/NewCheckOutModel"

const AddMoneyInWallet = ({ open, setOpenAddWalletModal, walletBalance }) => {
    const [loading, setLoading] = useState(false);
    const [addAmount, setAddAmonut] = useState(false)
    const [currencyCode, setCountryCode] = useState("inr")
    const [amount, setAmount] = useState('');
    const [isOpened, setIsOpened] = useState(false)
    const [option, setOption] = useState({})

    const handleChange = (event) => {
        setAmount(() => (event.target.value))
    };

    function handlAddToggle() {
        setAddAmonut(() => (true))
    }

    function handleClose() {
        setOpenAddWalletModal(() => (false))
        setAddAmonut(() => (false))
        setAmount("")
        setCountryCode("inr")

    }
    const handleCurrencyCodeChange = (event) => {
        setCountryCode(event.target.value);
    };

    async function createPaymentRequest() {
        setLoading(true)
        const reqBody = {
            amount: amount,
            currency: currencyCode
        }
        const response = await apiClient.post('/create_payment/', reqBody);
        if (response.data.status) {
            setOption(() => (response.data))
            setLoading(false)
            setIsOpened(true)
        }
    }

    function isHandleClose() {
        setIsOpened(false)
        setAmount("")
        setCountryCode("inr")
    }

    return (
        <>
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
                        p: 4,
                        width: '30%',
                        margin: 'auto',
                        mt: 10,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                        sx={{ textDecoration: 'underline' }}
                    >
                        My Wallet
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}

                    >
                        Wallet Balance  : ₹{walletBalance}
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}

                    >
                        Add Balance In Wallet
                        {addAmount ? null :
                            <Button
                                variant="contained"
                                sx={{ marginLeft: "15px" }}
                                onClick={handlAddToggle}
                            >
                                Add
                            </Button>
                        }
                    </Typography>
                    {
                        addAmount ? <>
                            <Stack container spacing={2}>
                                <FormControl fullWidth>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item s>
                                            <TextField
                                                fullWidth
                                                label="Amonut"
                                                name="amount"
                                                value={amount}
                                                onChange={handleChange}
                                                placeholder="Enter The Amount"
                                                type="number"
                                                InputProps={{
                                                    inputProps: { min: 0 }, // If you want to limit negative numbers
                                                    sx: {
                                                        '& input[type=number]': {
                                                            '-moz-appearance': 'textfield',  // Remove spinners in Firefox
                                                            '-webkit-appearance': 'none',    // Remove spinners in Chrome, Safari, Edge, Opera
                                                            'appearance': 'textfield',
                                                        },
                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                            '-webkit-appearance': 'none',
                                                            'margin': 0,
                                                        },
                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                            '-webkit-appearance': 'none',
                                                            'margin': 0,
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Select
                                                value={currencyCode}
                                                onChange={handleCurrencyCodeChange}
                                                sx={{ width: 'auto', minWidth: '140px' }}
                                            >
                                                {currencycodejson.map((code) => {
                                                    return (
                                                        <MenuItem key={code.symbol} value={code.code}>
                                                            {code.code} ({code.symbol})
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Stack>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <LoadingButton
                                    onClick={createPaymentRequest}
                                    variant="contained"
                                    color="primary"
                                    loading={loading}
                                    loadingPosition="start"
                                    loadingIndicator={
                                        <React.Fragment>
                                            <CircularProgress size={18} color="inherit" />
                                            {/* Creating.. */}
                                        </React.Fragment>
                                    }
                                >
                                    {/* {
                                      loading ? <>Loading....</> : <>Checkout</>
                                   }
                                   */}

                                    Checkout
                                </LoadingButton>
                                <Button onClick={handleClose} variant="contained" color="error" sx={{ ml: 2 }}>
                                    Cancel
                                </Button>
                            </Box>

                        </> : null
                    }


                </Box>
            </Modal>
            <Modal
                open={isOpened}
                onClose={isHandleClose}
                aria-labelledby="add-contact-modal"
                aria-describedby="add-contact-form"
                sx={{ padding : "15px" }}
            >
                <Box
                    sx={{
                        outline: 'none',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: '30%',
                        margin: 'auto',
                        mt: 10,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                        sx={{ textDecoration: 'underline' }}
                    >
                       Enter Payment Details
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                    >
                        <NewCheckOutModel
                            option={option}
                            isHandleClose={isHandleClose}
                        />
                    </Typography>
                </Box>
            </Modal >
        </>
    );
};

AddMoneyInWallet.propTypes = {
    open: PropTypes.bool.isRequired,
};

export default AddMoneyInWallet;
