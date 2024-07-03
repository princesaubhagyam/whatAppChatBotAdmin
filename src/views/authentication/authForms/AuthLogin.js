import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconLock, IconMail } from '@tabler/icons';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import apiClient from 'src/api/axiosClient';
import { useUser } from 'src/store/apps/UserContext';
import { setWalletBalance } from 'src/store/auth/AuthSlice';
import { LoadingButton } from '@mui/lab';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const initCredentials = {
    email: '',
    password: '',
  };

  const [credentials, setCredentials] = useState(initCredentials);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUserDetails } = useUser();

  const handleAuthStorage = (resData) => {
    localStorage.setItem('ref', resData.token.refresh);
    localStorage.setItem('access_app', resData.token.access);

    const fbMetaData = resData.facebook_meta_data;
    if (fbMetaData) {
      localStorage.setItem('graph_api_url', fbMetaData.graph_api_url);
      localStorage.setItem('api_version', fbMetaData.api_version);
      localStorage.setItem('app_id', fbMetaData.app_id);
      localStorage.setItem('embedded_configuration_id', fbMetaData.embedded_configuration_id);
      localStorage.setItem('phone_id', fbMetaData.phone_id);
      localStorage.setItem('whatsapp_business_account_id', fbMetaData.whatsapp_business_account_id);
      localStorage.setItem('access_meta', fbMetaData.access_token);
    }
  };

  const signInAPICall = async (creds) => {
    try {
      const res = await apiClient.post('/auth/signin/', { ...creds });
      if (res.status === 200) {
        console.log('login', res);
        handleAuthStorage(res.data.data);
        setUserDetails({
          full_name: res.data.data.full_name,
          email: res.data.data.email,
        });
        //dispatch(setWalletBalance(res.data.data.wallet_balance));

        toast.success('Sign in successful!', { duration: 2000 });
        navigate('/');
      }
    } catch (error) {
      if (error?.response?.data?.status === false) {
        toast.error('Invalid credentials!', { duration: 2000 });
      } else {
        toast.error(error.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setLoading(true);
      await signInAPICall(credentials);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.email) {
      newErrors.email = 'Please enter email!';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email!';
    }

    if (!credentials.password) {
      newErrors.password = 'Please enter password!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="800" variant="h1" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <form onSubmit={handleSignIn}>
        <Stack>
          <Box>
            <FormControl fullWidth error={!!errors.email}>
              <OutlinedInput
                sx={{ marginTop: 2 }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconMail width={22} color="dimgray" />
                  </InputAdornment>
                }
                id="username-text"
                placeholder="Enter Email"
                fullWidth
                name="email"
                onChange={handleFieldChange}
              />
              {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth error={!!errors.password}>
              <OutlinedInput
                sx={{ marginTop: 2 }}
                type="password"
                startAdornment={
                  <InputAdornment position="start">
                    <IconLock width={22} color="dimgray" />
                  </InputAdornment>
                }
                id="pwd-text"
                placeholder="Enter password"
                fullWidth
                name="password"
                onChange={handleFieldChange}
              />
              {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <div></div>
            <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <LoadingButton
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSignIn}
            loadingPosition="start"
            type="submit"
            loading={loading}
          >
            Sign In
          </LoadingButton>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthLogin;
