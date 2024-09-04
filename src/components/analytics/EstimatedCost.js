import {
    CardContent,
    Card,
    Box,
    Typography,
} from '@mui/material';
const EstimatedCost = ({ members, walletBalance }) => {
    return (
        <Card >
            <CardContent>
                <Box
                    sx={{
                        background: '#00720b40',
                        padding: '15px',
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                    }}
                >

                    <Typography
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        fontSize={'1rem'}
                        fontWeight={600}
                    >
                        Estimated Cost For Template
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            padding: '15px 0px',
                            cursor: 'pointer',
                        }}
                    >

                        <Box 
                        sx={{
                          width: "50%"
                        }}>
                            <Typography
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                fontSize={'0.86rem'}
                                fontWeight={400}
                            >
                                User Count
                            </Typography>
                            <Typography
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                fontSize={'0.86rem'}
                                fontWeight={400}
                            >
                                {members}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                fontSize={'0.86rem'}
                                fontWeight={400}
                            >
                                Estimated Cost
                            </Typography>
                            <Typography
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                fontSize={'0.86rem'}
                                fontWeight={400}
                            >
                                ₹{members}
                            </Typography>
                        </Box>
                    </Box>
                    {
                    parseInt(walletBalance) >= parseInt(members) ? null : <Typography
                        color="error"
                        fontSize={'1rem'}
                        fontWeight={400}
                    >
                        Your wallet balance is too low to send this template. Please add funds to your wallet. Your current balance is ₹{walletBalance}
                    </Typography>
                }
                </Box>
              
            </CardContent>
        </Card>
    );
};

export default EstimatedCost;
