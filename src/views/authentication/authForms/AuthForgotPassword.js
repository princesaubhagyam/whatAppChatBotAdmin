import React, { useState } from 'react';
import { Button, Stack, OutlinedInput, InputAdornment, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconMail } from '@tabler/icons';

import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';

import { LoadingButton } from '@mui/lab';
const AuthForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await apiClient.post('auth/send-reset-password-email/', { email });
      toast.success('Password reset link sent to your email address.');
      //navigate('/auth/reset-password');
      setEmail('');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack mt={4} spacing={2}>
      <CustomFormLabel htmlFor="reset-email">Email Address</CustomFormLabel>
      <OutlinedInput
        sx={{ marginTop: 2 }}
        startAdornment={
          <InputAdornment position="start">
            <IconMail width={20} color="dimgray" />
          </InputAdornment>
        }
        id="reset-email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        error={!!errors.email}
      />
      {errors.email && <Typography color="error">{errors.email}</Typography>}
      <LoadingButton
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
        loading={loading}
        loadingPosition="start"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </LoadingButton>
      {message && <Typography color="info">{message}</Typography>}
      <Button color="primary" size="large" fullWidth component={Link} to="/auth/login">
        Back to Login
      </Button>
    </Stack>
  );
};

export default AuthForgotPassword;
