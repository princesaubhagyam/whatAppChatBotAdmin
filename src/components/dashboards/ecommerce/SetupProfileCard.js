import React from 'react';
import { Card, CardContent, Typography, Skeleton } from '@mui/material';

const SetUpProfileCard = ({ freeTierUsedCount, freeTierConversation, totalCost, loading }) => {
  return (
    <Card>
      <CardContent sx={{ py: 1, p: 1, pb: '8px !important' }}>
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '4px',
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="text" width="80%" animation="wave" />
              <Skeleton variant="text" width="60%" animation="wave" />
            </>
          ) : (
            <>
              <Typography>
                <b>Free Service Conversation:</b> {freeTierUsedCount}/{freeTierConversation}
              </Typography>
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
