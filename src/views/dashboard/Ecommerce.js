import React from 'react';
import { Box, Grid } from '@mui/material';
import WeeklyStats from 'src/components/dashboards/modern/WeeklyStats';
import YearlySales from 'src/components/dashboards/ecommerce/YearlySales';
import PaymentGateways from 'src/components/dashboards/ecommerce/PaymentGateways';
import WelcomeCard from 'src/components/dashboards/ecommerce/WelcomeCard';
import Payment from 'src/components/dashboards/ecommerce/Payment';
import SalesProfit from 'src/components/dashboards/ecommerce/SalesProfit';
import RevenueUpdates from 'src/components/dashboards/ecommerce/RevenueUpdates';
import SalesOverview from 'src/components/dashboards/ecommerce/SalesOverview';
import TotalEarning from 'src/components/dashboards/ecommerce/TotalEarning';
import ProductsSold from 'src/components/dashboards/ecommerce/ProductsSold';
import MonthlyEarnings from 'src/components/dashboards/ecommerce/MonthlyEarnings';
import ProductPerformances from 'src/components/dashboards/ecommerce/ProductPerformances';
import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';
import AuthSocialButtons from '../authentication/authForms/AuthSocialButtons';
import QualityRatingCard from 'src/components/dashboards/ecommerce/QualityRatingCard';
import SetUpProfileCard from 'src/components/dashboards/ecommerce/SetupProfileCard';
import ViewProfileCard from 'src/components/dashboards/ecommerce/ViewProfileCard';

const Ecommerce = () => {
  console.log('hello');
  return (
    <Box mt={3}>
      {/* <AuthSocialButtons title="Sign in with" /> */}
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} lg={8}>
          <WelcomeCard />
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
              <QualityRatingCard />
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
              <ViewProfileCard />
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
  );
};

export default Ecommerce;
