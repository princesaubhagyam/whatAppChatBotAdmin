import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Skeleton, Box } from '@mui/material';

const SetUpProfileCard = ({ freeTierUsedCount, freeTierConversation, totalCost, loading }) => {
  const progress = (freeTierUsedCount / freeTierConversation) * 100;

  return (
    <Card>
      <CardContent sx={{ py: 1, p: 1, pb: '8px !important' }}>
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="text" width="80%" animation="wave" />
              <Skeleton variant="text" width="60%" animation="wave" />
            </>
          ) : (
            <>
              <Typography sx={{ marginBottom: '12px' }}>
                <b>Free Service Conversation:</b> {freeTierUsedCount}/{freeTierConversation} used
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">0</Typography>
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${progress}%`,
                      top: '-27px', // Adjusts the position of the label
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        width: '28px',
                        height: '20px',
                        backgroundColor: progress > 50 ? '#dbdbdb' : '#dbdbdb',
                        color: progress > 50 ? 'white' : 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '400',
                      }}
                    >
                      {freeTierUsedCount}
                    </Box>
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderLeft: '7px solid transparent',
                        borderRight: '7px solid transparent',
                        borderTop: `7px solid ${progress > 50 ? '#dbdbdb' : '#dbdbdb'}`,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2">{freeTierConversation}</Typography>
              </Box>
              <Typography>
                <b>WhatsApp Conversation Credits (WCC):</b> ₹{totalCost}
              </Typography>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SetUpProfileCard;
