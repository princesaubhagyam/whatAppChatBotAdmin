import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SetUpProfileCard = () => {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
          <Typography>Setup FREE WhatsApp Business Account </Typography>
          <Typography>2 days left</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SetUpProfileCard;
