import React from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthForgotPassword from '../authForms/AuthForgotPassword';
import img from 'src/assets/images/backgrounds/banner_one.jpg';

const ForgotPassword2 = () => (
  <PageContainer title="Forgot Password" description="this is Forgot Password page">
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
      }}
    >
      <Grid container spacing={0} sx={{ height: '100%' }}>
        {/* Image Section */}
        <Grid
          item
          xs={6}
          md={5}
          sx={{
            display: { xs: 'none', md: 'block' },
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></Grid>

        {/* Forgot Password Form Section */}
        <Grid
          item
          xs={12}
          md={7}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: 'white' }}
        >
          <Card
            elevation={9}
            sx={{
              p: 4,
              zIndex: 1,
              width: '100%',
              maxWidth: '460px',
              boxShadow: 'none !important',
              borderRadius: '0px !important',
              padding: '0px !important',
            }}
          >
            <Box display="flex" flexDirection="column">
              {/* <Typography variant="h6" fontWeight={'400'} lineHeight={'2.2rem'}>
                RESET PASSWORD
              </Typography> */}

              <Typography variant="h3" color={'primary.main'} fontWeight={700}>
                Forgot your password?
              </Typography>
            </Box>
            <Typography
              color="textSecondary"
              textAlign="left"
              variant="subtitle2"
              fontWeight="400"
              mt={2}
            >
              Please enter the email address associated with your account, and we will email you a
              link to reset your password.
            </Typography>
            <AuthForgotPassword />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default ForgotPassword2;
