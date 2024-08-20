import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SetUpProfileCard = () => {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Free Service Conversation 53 /1000 used</Typography>
          <Typography>WhatsApp Conversation Credits (WCC) $ 49.16</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SetUpProfileCard;
