import React from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import img from 'src/assets/images/backgrounds/banner_one.jpg';
import AuthRegister from '../authForms/AuthRegister';

const Register2 = () => (
  <>
    <PageContainer title="Register" description="this is Register page">
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
            md={6}
            sx={{
              display: { xs: 'none', md: 'block' },
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></Grid>

          <Grid
            item
            xs={12}
            md={6}
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
                <Typography
                  variant="h3"
                  color={'primary.main'}
                  fontWeight={700}
                  lineHeight={'3.75rem'}
                >
                  Create Your Saubhagyam Account
                </Typography>
              </Box>
              <AuthRegister
                subtitle={
                  <Stack direction="row" spacing={1} mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="400">
                      Already have an Account?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/auth/login"
                      fontWeight="500"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                      }}
                    >
                      Sign In
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

export default Register2;
