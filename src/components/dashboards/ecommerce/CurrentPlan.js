import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CurrentPlan = () => {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Current Plan renews on 07/09/24 </Typography>
          <Typography>PRO (monthly)</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;
