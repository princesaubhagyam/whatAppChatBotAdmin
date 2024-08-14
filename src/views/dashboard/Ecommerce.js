import React, { useEffect, useState } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
// import WeeklyStats from 'src/components/dashboards/modern/WeeklyStats';
// import YearlySales from 'src/components/dashboards/ecommerce/YearlySales';
// import PaymentGateways from 'src/components/dashboards/ecommerce/PaymentGateways';
import WelcomeCard from 'src/components/dashboards/ecommerce/WelcomeCard';
// import Payment from 'src/components/dashboards/ecommerce/Payment';
// import SalesProfit from 'src/components/dashboards/ecommerce/SalesProfit';
// import RevenueUpdates from 'src/components/dashboards/ecommerce/RevenueUpdates';
// import SalesOverview from 'src/components/dashboards/ecommerce/SalesOverview';
// import TotalEarning from 'src/components/dashboards/ecommerce/TotalEarning';
import ProductsSold from 'src/components/dashboards/ecommerce/ProductsSold';
// import MonthlyEarnings from 'src/components/dashboards/ecommerce/MonthlyEarnings';
// import ProductPerformances from 'src/components/dashboards/ecommerce/ProductPerformances';
// import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';
// import AuthSocialButtons from '../authentication/authForms/AuthSocialButtons';
import QualityRatingCard from 'src/components/dashboards/ecommerce/QualityRatingCard';
import SetUpProfileCard from 'src/components/dashboards/ecommerce/SetupProfileCard';
import ViewProfileCard from 'src/components/dashboards/ecommerce/ViewProfileCard';
import apiClient from 'src/api/axiosClient';
import BasicAlerts from "../../components/alert/Alert"
import Spinner from "src/views/spinner/Spinner"

const Ecommerce = () => {
  // console.log('hello');
  const [showCard, setShowcard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading,setIsLoading] = useState(false)
  const [userQaulity,setUserQaulity] = useState("")

  const checkFacebookLogin = async () => {
    try {
      const res = await apiClient.get('/auth/user_profile/')
      if (res.status === 200) {
        const phoneId = res.data.data.facebook_meta_data.phone_id;

        if (!phoneId || phoneId.trim() === '') {
          setShowcard(false);
        } else {
          setShowcard(true);
        }
      }
    } catch (error) {
      console.error('Error fetching Facebook meta info:', error);
      setShowcard(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFacebookLogin();
  }, [isLoading]);
  
  useEffect(()=>{
   setTimeout(()=>{
    setIsLoading(false)
   },3000)
  },[])

  return (
     isLoading ?< Spinner /> :
     <>
       {/* { "UNKNOWN" ==="UNKNOWN" ?  <BasicAlerts /> : null} */}
    <Box mt={3}> 
      {/* <AuthSocialButtons title="Sign in with" /> */}
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} lg={8}>
          <WelcomeCard  
           setIsLoading = {setIsLoading}
          />
        </Grid>

        {/* column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={6}>
              <Payment />
            </Grid> */}
            <Grid item xs={12} sm={6} lg={12}>
              <ProductsSold />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} lg={8}>
          <QualityRatingCard />
        </Grid>
        <Grid item xs={12} lg={8}>
          <SetUpProfileCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SalesOverview />
        </Grid> */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="rounded" width={705} height={113} animation="wave" />
              ) : showCard ? (
                <QualityRatingCard
                isLoading ={isLoading}
                setUserQaulity= {setUserQaulity}
                />
              ) : null}
            </Grid>
            {/* <Grid item xs={12} lg={14}>
              <ViewProfileCard />
            </Grid> */}
          </Grid>
          {/* <Grid item xs={12} sm={6} lg={4}>
            <SalesOverview />
            </Grid> */}
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TotalEarning />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SalesProfit />
            </Grid>
            <Grid item xs={12}>
              <MonthlyEarnings />
            </Grid>
          </Grid>
        </Grid> */}
        {/* column */}
        <Grid item xs={12} sm={6} lg={4}>
          <SetUpProfileCard />
        </Grid>
        <Grid item xs={12} lg={14}>
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
              <ViewProfileCard
              isLoading ={isLoading} 
              />
            </>
          ) : null}
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          {/* <YearlySales /> */}
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          {/* <PaymentGateways /> */}
        </Grid>
        {/* column */}

        <Grid item xs={12} lg={4}>
          {/* <RecentTransactions /> */}
        </Grid>
        {/* column */}

        <Grid item xs={12} lg={8}>
          {/* <ProductPerformances /> */}
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Ecommerce;
