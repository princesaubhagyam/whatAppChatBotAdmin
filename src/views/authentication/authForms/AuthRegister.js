import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Stack,
  Button,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconLock, IconMail, IconPhone, IconUser } from '@tabler/icons';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import apiClient from 'src/api/axiosClient';
import countryCodes from 'src/utils/Countrycode.json';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const initCredentials = {
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
  };
  const navigate = useNavigate();

  const [credentials, setCredentials] = React.useState(initCredentials);
  const [loading, setLoading] = React.useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = React.useState({});

  // const countryCodes = [
  //   { value: '+91', label: 'India (+91)' },
  //   { value: '+1', label: 'USA (+1)' },
  //   { value: '+44', label: 'UK (+44)' },
  //   // Add more country codes as needed
  // ];

  const signUpAPICall = async (creds) => {
    try {
      const res = await apiClient.post('/auth/signup/', { ...creds });
      if (res.status === 201) {
        navigate('/auth/login');
        toast.success('Sign up successful!');
      }
    } catch (error) {
      if (error?.response?.data?.status === false) {
        toast.error(error.response.data.message, { duration: 2000 });
      } else {
        toast.error(error.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    if (validateForm()) {
      setLoading(true);
      if (!credentials.password.length || !credentials.confirm_password.length) {
        toast.error('Please enter password!');
        setLoading(false);
      } else if (credentials.password !== credentials.confirm_password) {
        toast.error('Passwords do not match!');
        setLoading(false);
      } else {
        signUpAPICall(credentials);
      }
    }
  };

  const handleFieldChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    setCredentials((prev) => ({
      ...prev,
      mobile: e.target.value + prev.mobile.replace(/^\+\d+/, ''),
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!credentials.full_name) {
      errors.full_name = 'Please enter your full name';
      isValid = false;
    }

    if (!credentials.email) {
      errors.email = 'Please enter your email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!credentials.mobile) {
      errors.mobile = 'Please enter your mobile number';
      isValid = false;
    } else if (!/^\+?[0-9]{10,14}$/.test(credentials.mobile)) {
      errors.mobile = 'Please enter a valid mobile number';
      isValid = false;
    }

    if (!credentials.password) {
      errors.password = 'Please enter your password';
      isValid = false;
    }

    if (!credentials.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
      isValid = false;
    } else if (credentials.password !== credentials.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.full_name}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Full Name"
              fullWidth
              name="full_name"
              onChange={handleFieldChange}
            />
            {errors.full_name && <FormHelperText error>{errors.full_name}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.email}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Email"
              fullWidth
              name="email"
              onChange={handleFieldChange}
            />
            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.mobile}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                sx={{ width: 'auto', minWidth: '100px' }}
              >
                {countryCodes.map((code) => (
                  <MenuItem key={code.dial_code} value={code.dial_code}>
                    {code.code} ({code.dial_code})
                  </MenuItem>
                ))}
              </Select>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconPhone width={20} color="dimgray" />
                  </InputAdornment>
                }
                placeholder="Enter Mobile Number"
                fullWidth
                name="mobile"
                value={credentials.mobile}
                onChange={handleFieldChange}
              />
            </Stack>
            {errors.mobile && <FormHelperText error>{errors.mobile}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.password}>
            <OutlinedInput
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Password"
              fullWidth
              name="password"
              onChange={handleFieldChange}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.confirm_password}>
            <OutlinedInput
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} color="dimgray" />
                </InputAdornment>
              }
              placeholder="Enter Confirm Password"
              fullWidth
              name="confirm_password"
              onChange={handleFieldChange}
            />
            {errors.confirm_password && (
              <FormHelperText error>{errors.confirm_password}</FormHelperText>
            )}
          </FormControl>
        </Stack>

        <Box mt={2}>
          <LoadingButton
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSignUp}
            type="submit"
            loading={loading}
            loadingPosition="start"
          >
            Sign Up
          </LoadingButton>
        </Box>

        {subtitle}
      </form>
    </>
  );
};

export default AuthRegister;
