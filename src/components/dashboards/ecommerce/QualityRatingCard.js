import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Badge } from '@mui/material';
import axiosClientBm from 'src/api/axiosClientBm';

const QualityRatingCard = () => {
  const [remainingQuota, setRemainingQuota] = useState(1000);
  const [apiStatus, setApiStatus] = useState();
  const [qualityRating, setQualityRating] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClientBm.get('phone_numbers');
        const fetchedQualityRating = response?.data?.data[0]?.quality_rating;
        const fetchedApiStatus = response?.data?.data[0]?.throughput?.level;

        setQualityRating(fetchedQualityRating);
        setApiStatus(fetchedApiStatus);

        console.log('API Response:', response);
        console.log('Quality Rating:', fetchedQualityRating);
        console.log('API Status:', fetchedApiStatus);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <div>
            <Typography>WhatsApp Business Cloud API Status</Typography>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{
                  marginLeft: '2.3rem'
              }}
              badgeContent={apiStatus}
              color="primary"
            ></Badge>
          </div>
          <div>
            <Typography>Quality Rating</Typography>
            <Badge
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{
                  marginLeft: '1.5rem'
              }}
              badgeContent={qualityRating}
              color="primary"
            ></Badge>
          </div>
          <div>
            <Typography>Remaining Quota</Typography>
            <Typography variant={'h6'}>{remainingQuota}</Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QualityRatingCard;
