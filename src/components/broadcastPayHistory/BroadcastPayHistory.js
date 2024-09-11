import React, { useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiClient from 'src/api/axiosClient';
import { useSelector } from 'react-redux';

function BroadcastPayHistory({ setBroadcastPayHistroy }) {
    const [loading, setLoading] = useState(true)
    const [broadcastPayHistoryData, setBroadcastPayHistoryData] = useState({})
    const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast?.id);

    async function getBroadcastPayHistoryData() {
        try {
            const res = await apiClient.get(`api/holdamount-history/${activeBroadcast}`)
            if (res.data.status) {
                setBroadcastPayHistoryData(res.data.data,)
                setLoading(false)
            }
        } catch (error) {
            console.error(error, "error")
            setLoading(false)
        }
    }

    useState(() => {
        getBroadcastPayHistoryData()
    }, [])

    function closeBroadcastPayHistroy() {
        setBroadcastPayHistroy(false);
    }
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            {
                loading ? <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            width={320}
                            height={35}
                            sx={{ margin: "25px 0px 0px 30px" }}
                            animation="wave"
                        />
                        <Skeleton
                            variant="circular"
                            width={25}
                            height={25}
                            sx={{
                                marginRight: '30px',
                                marginTop: '25px',
                            }}
                            animation="wave"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "100%",
                            padding: "50px"
                        }}
                    >
                        <Box
                            sx={{
                                width: "40%"
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width={50}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={170}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={200}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={170}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={200}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                        </Box>
                        <Box>
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                            <Skeleton
                                variant="rectangular"
                                width={30}
                                height={25}
                                sx={{ margin: "15px 0px" }}
                                animation="wave"
                            />
                        </Box>

                    </Box>
                </> : <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h4"
                            color="primary"

                            sx={{
                                padding: "25px 0px 0px 30px"
                            }}
                        >Broadcast Transaction History</Typography>
                        <CloseIcon
                            fontSize="medium"
                            sx={{
                                marginRight: '30px',
                                marginTop: '25px',
                                cursor: 'pointer',
                            }}
                            onClick={closeBroadcastPayHistroy}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "100%",
                            padding: "50px"
                        }}
                    >
                        <Box
                            sx={{
                                width: "40%"
                            }}>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Sent:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Delivered:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Failed:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Initial Hold Money:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Current Hold Money:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Released Money:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Cost per Delivered:</Typography>
                            <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Total Cost:</Typography>

                        </Box>
                        <Box>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.sent ?  broadcastPayHistoryData.sent : 0}</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.delivered ? broadcastPayHistoryData.delivered : 0 }</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.failed ? broadcastPayHistoryData.failed : 0}</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.initial_holdamount ?broadcastPayHistoryData.initial_holdamount : 0}</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.current_holdamount > 0 ? broadcastPayHistoryData.current_holdamount : 0}</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{broadcastPayHistoryData.released_amount}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >{ (broadcastPayHistoryData.delivered) === 0 ? (broadcastPayHistoryData.pay_amount) / 1 : (broadcastPayHistoryData.pay_amount) / (broadcastPayHistoryData.delivered)}</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px" 
                                }}
                            >{broadcastPayHistoryData.pay_amount > 0 ? broadcastPayHistoryData.pay_amount : 0}</Typography>
                        </Box>
                    </Box>

                </>
            }
        </Box>
    );
}

export default BroadcastPayHistory;
