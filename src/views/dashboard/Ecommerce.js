import React, { useEffect, useState } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import WelcomeCard from 'src/components/dashboards/ecommerce/WelcomeCard';
import QualityRatingCard from 'src/components/dashboards/ecommerce/QualityRatingCard';
import SetUpProfileCard from 'src/components/dashboards/ecommerce/SetupProfileCard';
// import ViewProfileCard from 'src/components/dashboards/ecommerce/ViewProfileCard';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import ProfileDetail from 'src/components/dashboards/ecommerce/ProfileDetail';
import PageContainer from 'src/components/container/PageContainer';
// import CurrentPlan from 'src/components/dashboards/ecommerce/CurrentPlan';

const Ecommerce = () => {
  const [showCard, setShowCard] = useState(false);
  const [totalCost, setTotalCost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [freeTierUsedCount, setFreeTierUsedCount] = useState(null);
  const [freeTierConversation, setFreeTierConversation] = useState(null);

  useEffect(() => {
    checkFacebookLogin();
  }, []);

  const checkFacebookLogin = async () => {
    try {
      const res = await apiClient.get('/auth/user_profile/');
      // console.log(res, "res")
      if (res.status === 200) {
        const phoneId = res.data.data.facebook_meta_data.phone_id;
        if (!phoneId || phoneId.trim() === '') {
          setShowCard(false);
        } else {
          setShowCard(true);
          fetchConversationAnalytics();
        }
      }
    } catch (error) {
      console.error('Error fetching Facebook meta info:', error);
      setShowCard(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationAnalytics = async () => {
    setLoading(true);
    try {
      const waba_id = localStorage.getItem('whatsapp_business_account_id');
      const res = await apiClient.get(
        `/auth/conversation-analytics/?whatsapp_business_account_id=${waba_id}`,
      );
      if (res.status === 200) {
        setFreeTierUsedCount(res.data.free_tier_used_count);
        setFreeTierConversation(res.data.free_tier_conversation);
        setTotalCost(res?.data?.total_cost);
      }
    } catch (error) {
      console.error('Error fetching conversation analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const remainingQuota = freeTierConversation - freeTierUsedCount;

  return loading ? (
    <Spinner />
  ) : (
    <PageContainer title="Dashboard" description="This is the User Dashborad" >
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={12}>
                {loading ? (
                  <Skeleton variant="rounded" width={705} height={113} animation="wave" />
                ) : showCard ? (
                  <ProfileDetail />
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} lg={12}>
                {loading ? (
                  <Skeleton variant="rounded" width={705} height={113} animation="wave" />
                ) : showCard ? (
                  <SetUpProfileCard
                    freeTierUsedCount={freeTierUsedCount}
                    freeTierConversation={freeTierConversation}
                    totalCost={totalCost}
                    loading={loading}
                  />
                ) : null}
                {/* {loading ? (
                <Skeleton variant="rounded" width={705} height={113} animation="wave" />
              ) : showCard ? (
                <CurrentPlan />
              ) : null} */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} paddingTop={'10px !important'}>
                {loading ? (
                  <Skeleton variant="rounded" width={705} height={113} animation="wave" />
                ) : showCard ? (
                  <QualityRatingCard remainingQuota={remainingQuota} loading={loading} />
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={6} lg={4}>
          {loading ? (
            <Skeleton variant="rounded" width={705} height={113} animation="wave" />
          ) : showCard ? (
            <SetUpProfileCard
              freeTierUsedCount={freeTierUsedCount}
              freeTierConversation={freeTierConversation}
              totalCost={totalCost}
              loading={loading}
            />
          ) : null}
        </Grid> */}
          {/* <Grid item xs={12} lg={14}>
          {loading ? (
            <Skeleton
              variant="rounded"
              width={1069}
              height={117}
              animation="wave"
              sx={{ bgcolor: 'grey.100' }}
            />
          ) : showCard ? (
            <>
              <ViewProfileCard />
            </>
          ) : null}
        </Grid> */}
        </Grid>
      </Box>
    </PageContainer>

  );
};

export default Ecommerce;
