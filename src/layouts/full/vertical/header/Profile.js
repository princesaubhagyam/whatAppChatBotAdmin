import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Button, IconButton, MenuItem } from '@mui/material';
import { useUser } from 'src/store/apps/UserContext';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { useSelector } from 'react-redux';
const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const walletBalance = useSelector((state) => state.authReducer.wallet_balance);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const { user } = useUser();

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 500, color: '#545557'}}>Wallet</Typography>
      <Typography variant="h5" sx={{ fontWeight: 500, color: '#545557'}}>₹{walletBalance}.00</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Typography variant="h6" sx={{ marginRight: '6px', fontWeight: 500, fontSize: '15px' }}>
        Hello, {user ? user.full_name : 'User'}
      </Typography> */}

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
              {/* <Typography variant="h6" color="textPrimary" fontWeight={600}>
              {user ? user.full_name : 'Guest'}
            </Typography>
            <Typography variant="subtitle2" color="gray">
              {user ? user.email : 'guest@example.com'}
            </Typography> */}
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
