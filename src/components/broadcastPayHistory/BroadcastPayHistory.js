import React, { useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function BroadcastPayHistory({ setBroadcastPayHistroy }) {
    const [loading, setLoading] = useState(true)

 useState(()=>{
    setTimeout(()=>{
        setLoading(()=>(false))
    },1000)
 },[])

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
                        >Broadcast Transaction Histroy</Typography>
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
                    {/* <Box
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
                            >Realased Money:</Typography>
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
                            >10</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >8</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >₹10</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >₹5</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >₹3</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >totalcost/delivered</Typography>
                            <Typography variant="subtitle1" color="textSecondary"
                                sx={{
                                    padding: "12px 0px"
                                }}
                            >₹5</Typography>
                        </Box>
                    </Box> */}
                    
                    <Typography variant="h1" fontWeight="bold"
                                sx={{
                                    padding: "15px 0px"
                                }}
                            >Coming soon</Typography>

                </>
            }
        </Box>
    );
}

export default BroadcastPayHistory;
