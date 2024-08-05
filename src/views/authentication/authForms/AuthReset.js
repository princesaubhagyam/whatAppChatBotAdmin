import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Stack,
  Typography,
  Box,
  Card,
  Grid,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

const AuthReset = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [validToken, setValidToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await apiClient.get(`auth/verify-token/${token}/`);
      } catch (error) {
        setValidToken(false);
        setMessage('Invalid or expired token.');
        navigate('/auth/404');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setValidToken(false);
      toast.error('Invalid or expired token.');
      navigate('/auth/404');
    }
  }, [token, navigate]);

  const handleClickShowPassword = (field) => {
    if (field === 'new') setShowNewPassword(!showNewPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const errors = {};
    if (!newPassword) errors.newPassword = 'New password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await apiClient.post(`auth/reset-password/${token}/`, {
        password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success('Password reset successfully.');
      navigate('/auth/login');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return null;
  }

  return (
    <PageContainer title="Reset Password" description="Reset your password">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <form onSubmit={handleResetPassword}>
                <FormControl fullWidth margin="normal" error={!!errors.newPassword}>
                  <InputLabel htmlFor="new-password">New Password</InputLabel>
                  <OutlinedInput
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('new')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                  {errors.newPassword && <FormHelperText>{errors.newPassword}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.confirmPassword}>
                  <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                  <OutlinedInput
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('confirm')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm New Password"
                  />
                  {errors.confirmPassword && (
                    <FormHelperText>{errors.confirmPassword}</FormHelperText>
                  )}
                </FormControl>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, width: '100%' }}
                  type="submit"
                  loading={loading}
                  loadingPosition="start"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </LoadingButton>
                {message && (
                  <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                    {message}
                  </Typography>
                )}
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default AuthReset;
