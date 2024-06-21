import { Card, CardContent, Typography, Stack, Badge } from '@mui/material';
import React from 'react';

const QualityRatingCard = () => {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <div>
            <Typography>WhatsApp Business API Status</Typography>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'LEFT',
              }}
              badgeContent={'LIVE'}
              color="success"
            ></Badge>
          </div>
          <div>
            <Typography>Quality Rating</Typography>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'LEFT',
              }}
              badgeContent={'LOW'}
              color="error"
            ></Badge>
          </div>
          <div>
            <Typography>Remaining Quota</Typography>
            <Typography variant={'h6'}>1000</Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QualityRatingCard;
