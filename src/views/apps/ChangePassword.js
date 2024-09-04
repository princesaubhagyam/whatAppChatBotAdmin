import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const errors = {};
    if (!oldPassword) errors.oldPassword = 'Old password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = 'New password and confirm password do not match';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await apiClient.post('/auth/change_password/', {
        old_password: oldPassword,
        password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.status === 200) {
        toast.success('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      }
    } catch (error) {
      if (error?.response?.data?.status === false) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}
    >
      <Card sx={{ width: '40%' }}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
          <form onSubmit={handleChangePassword}>
            <FormControl fullWidth margin="normal" error={!!errors.oldPassword}>
              <InputLabel htmlFor="old-password">Old Password</InputLabel>
              <OutlinedInput
                id="old-password"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('old')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Old Password"
              />
              {errors.oldPassword && <FormHelperText>{errors.oldPassword}</FormHelperText>}
            </FormControl>

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
              {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: '100%' }}
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
            {message && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </form>
        </Box>
      </Card>
    </div>
  );
};

export default ChangePassword;
