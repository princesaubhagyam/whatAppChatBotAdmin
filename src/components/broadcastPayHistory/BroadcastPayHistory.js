import React, { useState } from 'react';
import { Box, Typography, Skeleton, Grid, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiClient from 'src/api/axiosClient';
import { useSelector } from 'react-redux';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

function BroadcastPayHistory({ setBroadcastPayHistroy }) {
  const [loading, setLoading] = useState(true);
  const [broadcastPayHistoryData, setBroadcastPayHistoryData] = useState({});
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast?.id);

  async function getBroadcastPayHistoryData() {
    try {
      const res = await apiClient.get(`api/holdamount-history/${activeBroadcast}`);
      if (res.data.status) {
        setBroadcastPayHistoryData(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, 'error');
      setLoading(false);
    }
  }

  useState(() => {
    getBroadcastPayHistoryData();
  }, []);

  function closeBroadcastPayHistroy() {
    setBroadcastPayHistroy(false);
  }
  return (
    <>
      <Box sx={{ width: '100%', backgroundColor: '#EBEBEB' }}>
        {loading ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton
                variant="rectangular"
                width={240}
                height={20}
                sx={{ margin: '25px 0px 0px 30px' }}
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
            <Box sx={{ display: 'flex', justifyContent: 'normal' }}>
              <Skeleton
                variant="rectangular"
                width={320}
                height={35}
                sx={{ margin: '25px 0px 0px 30px' }}
                animation="wave"
              />
            </Box>
            <Box sx={{ padding: '35px 30px 0px 20px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'center'}>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ padding: '35px 30px 0px 20px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'center'}>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ padding: '35px 30px 0px 20px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'normal'}>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box variant="outlined" sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={380} height={70} animation="wave" />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="muted" sx={{ padding: '25px 0px 0px 30px' }}>
                Broadcast Transaction History
              </Typography>
              <CloseIcon
                fontSize="medium"
                sx={{ marginRight: '30px', marginTop: '25px', cursor: 'pointer' }}
                onClick={closeBroadcastPayHistroy}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'normal' }}>
              <Box
                sx={{
                  padding: '25px 0px 0px 30px',
                }}
              >
                <AutoGraphIcon style={{ color: '#089046', fontSize: '30px' }} />
              </Box>
              <Typography variant="h4" sx={{ padding: '25px 0px 0px 5px' }}>
                {broadcastPayHistoryData.broadcast_name}
              </Typography>
            </Box>
            <Box sx={{ padding: '20px 30px 0px 30px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'center'}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Sent</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.sent ? broadcastPayHistoryData.sent : 0}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Delivered</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.delivered ? broadcastPayHistoryData.delivered : 0}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Failed</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.failed ? broadcastPayHistoryData.failed : 0}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ padding: '20px 30px 0px 30px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'center'}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Initial Hold Amount </Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.initial_holdamount > 0 ? (
                        <>₹{broadcastPayHistoryData.initial_holdamount} </>
                      ) : (
                        <> ₹0</>
                      )}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Current Hold Amount</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.current_holdamount > 0 ? (
                        <>₹{broadcastPayHistoryData.current_holdamount} </>
                      ) : (
                        <> ₹0</>
                      )}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Released Amount</Typography>
                    <Typography variant="h5">
                      ₹
                      {broadcastPayHistoryData.released_amount
                        ? parseFloat(broadcastPayHistoryData.released_amount).toFixed(2)
                        : '0.00'}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ padding: '20px 30px 0px 30px' }}>
              <Grid container spacing={2} mb={2} justifyContent={'normal'}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Cost per message delivered</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.delivered > 0 ? (
                        <>
                          ₹
                          {parseFloat(
                            broadcastPayHistoryData.pay_amount / broadcastPayHistoryData.delivered,
                          ).toFixed(2)}
                        </>
                      ) : (
                        <>₹0.00</>
                      )}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ padding: 2 }}>
                    <Typography variant="h6">Total Cost</Typography>
                    <Typography variant="h5">
                      {broadcastPayHistoryData.pay_amount > 0 ? (
                        <>₹{parseFloat(broadcastPayHistoryData.pay_amount).toFixed(2)}</>
                      ) : (
                        <>₹0.00</>
                      )}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default BroadcastPayHistory;
