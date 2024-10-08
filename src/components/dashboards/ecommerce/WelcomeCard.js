import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Skeleton } from '@mui/material';
// import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import welcomeImg from 'src/assets/images/backgrounds/welcome-bg23.png';
import AuthSocialButtons from 'src/views/authentication/authForms/AuthSocialButtons';
import apiClient from 'src/api/axiosClient';
import {FirstLetterCapitalOfString} from "src/utils/FirstLetterCapitalOfString"

const WelcomeCard = ({setIsLoading}) => {
  const [showSocialButtons, setShowSocialButtons] = useState(true);
  const [userName,setUserName] = useState("")
  const [loading, setLoading] = useState(true);
  

  const checkFacebookLogin = async () => {
    try {
      const res = await apiClient.get('/auth/user_profile/');
      if (res.status === 200) {
        setUserName(res.data.data.display_name)
        const phoneId = res.data.data.facebook_meta_data.phone_id;
        setShowSocialButtons(!phoneId || phoneId.trim() === '');
      }
    } catch (error) {
      console.error('Error fetching Facebook meta info:', error);
      setShowSocialButtons(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFacebookLogin();
  }, []);

  return (
    <Card elevation={0} sx={{ backgroundColor: (theme) => theme.palette.primary.light, py: 0 }}>
      <CardContent sx={{ py: 2 ,paddingTop : "27px"}}>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item sm={6} display="flex" alignItems="center">
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                },
              }}
            >
              {loading ? (
                <>
                  <Skeleton variant="text" width={200} height={40} animation="wave" />
                  <Skeleton
                    variant="text"
                    width={300}
                    height={20}
                    sx={{ my: 2 }}
                    animation="wave"
                  />
                  <Skeleton variant="rectangular" width={200} height={40} animation="wave" />
                </>
              ) : (
                <>
                  <Typography variant="h3">Welcome {userName ? FirstLetterCapitalOfString(userName) : ""}!</Typography>
                  {/* <Typography variant="subtitle2" my={2} color="textSecondary">
                    You have earned 54% more than last month which is great thing.
                  </Typography> */}
                  {showSocialButtons && <AuthSocialButtons   setIsLoading = {setIsLoading}  title="Sign in with" />}
                </>
              )}
            </Box>
          </Grid>
          <Grid item sm={5}>
            <Box>
              {loading ? (
                <Skeleton variant="rectangular" width={300} height={200} animation="wave" />
              ) : (
                <img src={welcomeImg} alt="Welcome" width={'300px'} 
                style={{ marginTop: '30px', marginBottom: '-30px' }}
                
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
