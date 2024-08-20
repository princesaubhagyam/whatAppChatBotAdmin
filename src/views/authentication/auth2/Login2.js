import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Divider } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import toast, { Toaster } from 'react-hot-toast';
import img from 'src/assets/images/backgrounds/baner.jpg';
const Login2 = () => {
  return (
    <>
      <PageContainer title="Login" description="this is Login page">
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

            {/* Login Form Section */}
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
                  padding: '12px !important',
                }}
              >
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'400'} lineHeight={'2.2rem'}>
                    WELCOME BACK
                  </Typography>

                  <Typography
                    variant="h3"
                    color={'primary.main'}
                    fontWeight={700}
                    lineHeight={'2.75rem'}
                  >
                    Login to Saubhagyam
                  </Typography>
                </Box>
                <AuthLogin
                  subtitle={
                    <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                      <Typography color="textSecondary" variant="h6" fontWeight="500">
                        New to Saubhagyam?
                      </Typography>
                      <Typography
                        component={Link}
                        to="/auth/register"
                        fontWeight="500"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        Create an account
                      </Typography>
                    </Stack>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </>
  );
};

export default Login2;
