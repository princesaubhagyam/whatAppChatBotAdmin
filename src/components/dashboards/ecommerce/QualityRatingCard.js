import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Badge, Skeleton} from '@mui/material';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';

const QualityRatingCard = ( { isLoading}) => {
  const [remainingQuota,] = useState(1000);
  const [apiStatus, setApiStatus] = useState(null);
  const [qualityRating, setQualityRating] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    fetchData();
  }, [isLoading]);

  const fetchData = async () => {
    try {
      const metaClient =  createMetaAxiosInstance({ addBAId: false });
      const phoneId = localStorage.getItem('phone_id');
      const response = await metaClient.get(`${phoneId}`);
      const fetchedQualityRating = response?.data?.quality_rating;
      const fetchedApiStatus = response?.data?.throughput?.level;
      setQualityRating(fetchedQualityRating);
      setApiStatus(fetchedApiStatus);
      setLoading(false);
      console.log('QualityRatingCard - qualityRating:', fetchedQualityRating);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false); 
    }
  };
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
                sx={{ marginLeft: '2.3rem' }}
                badgeContent={apiStatus}
                color="primary"
              ></Badge>
          </div>
          <div>
            <Typography>Quality Rating</Typography>
            {loading ? (
              <Skeleton variant="text" width={100} animation="wave"/>
            ) : qualityRating ==="UNKNOWN" ? <Badge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                sx={{ marginLeft: '1.5rem',}}
                badgeContent={qualityRating}
                color="muted"
              ></Badge> : 
              qualityRating ==="GREEN" ?
            (
              <Badge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                sx={{ marginLeft: '1.5rem',}}
                badgeContent={qualityRating}
                color="primary"
              ></Badge> 
            ) : qualityRating ==="YELLOW" ? (
              <Badge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                sx={{ marginLeft: '1.5rem',}}
                badgeContent={qualityRating}
                color="warning"
              ></Badge> 
            ) : <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{ marginLeft: '1.5rem',}}
            badgeContent={qualityRating}
            color="error"
          ></Badge>  }
          </div>
          <div>
            <Typography>Remaining Quota</Typography>
            {loading ? (
              <Skeleton variant="text" width={80} animation="wave" />
            ) : (
              <Typography variant={'h6'}>{remainingQuota}</Typography>
            )}
          </div>
        </Stack>
      </CardContent>     
    </Card>
  );
};

export default QualityRatingCard;
