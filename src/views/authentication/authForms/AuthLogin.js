import React from 'react';
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
import toast, { Toaster } from 'react-hot-toast';

import apiClient from 'src/api/axiosClient';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const initCredentials = {
    email: '',
    password: '',
  };

  const [credentials, setCredentials] = React.useState(initCredentials);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleAuthStorage = (resData) => {
    localStorage.setItem('ref', resData.token.refresh);
    localStorage.setItem('access', resData.token.access);
  };

  const signInAPICall = async (creds) => {
    try {
      const res = await apiClient.post('/auth/signin/', { ...creds });
      if (res.status === 200) {
        handleAuthStorage(res.data.data);
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
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSignIn}
          disabled={loading}
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
      </form>
    </>
  );
};

export default AuthLogin;
