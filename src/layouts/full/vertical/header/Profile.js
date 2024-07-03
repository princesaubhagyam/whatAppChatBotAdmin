import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, IconButton, MenuItem } from '@mui/material';
import axios from 'axios';
import { useUser } from 'src/store/apps/UserContext';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import apiClient from 'src/api/axiosClient';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [walletBalance, setWalletBalance] = useState();

  const { user } = useUser();

  useEffect(() => {
    
    const fetchWalletBalance = async () => {
      try {
        const response = await apiClient.get('/wallet/');
        if (response.status === 200) {
          console.log(response);
          setWalletBalance(response.data.data.balance); 
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchWalletBalance();
  }, []);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 500, color: '#545557' }}>
        Wallet
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 500, color: '#545557' }}>
        ₹{walletBalance}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          size="large"
          aria-label="show user profile"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          sx={{
            ...(typeof anchorEl2 === 'object' && {
              color: 'primary.main',
            }),
          }}
          onClick={handleClick2}
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              backgroundColor: 'primary.main',
            }}
          >
            {user && user.full_name ? user.full_name.charAt(0) : ''}
          </Avatar>
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '160px',
            },
          }}
        >
          <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
            <Box>
              <Box>
                <MenuItem
                  component={Link}
                  to="/user-profile"
                  onClick={handleClose2}
                  sx={{
                    fontSize: '16px',
                    fontWeight: '400',
                    '&:hover': {
                      backgroundColor: `#1A4D2E`,
                      color: `white`,
                    },
                  }}
                >
                  Your Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/change-password"
                  onClick={handleClose2}
                  sx={{
                    fontSize: '16px',
                    fontWeight: '400',
                    '&:hover': {
                      backgroundColor: `#1A4D2E`,
                      color: `white`,
                    },
                  }}
                >
                  Change Password
                </MenuItem>
                <MenuItem
                  sx={{
                    fontSize: '16px',
                    fontWeight: '400',
                    '&:hover': {
                      backgroundColor: `#1A4D2E`,
                      color: `white`,
                    },
                  }}
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('ref');
                    localStorage.removeItem('access_app');
                    handleClose2();
                  }}
                  component={Link}
                  to="/auth/login"
                >
                  Logout
                </MenuItem>
              </Box>
            </Box>
          </Scrollbar>
        </Menu>
      </Box>
    </>
  );
};

export default Profile;
