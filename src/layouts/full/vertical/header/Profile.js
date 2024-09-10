import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  IconButton,
  MenuItem,
  Stack,
  Skeleton,
  Tooltip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useUser } from 'src/store/apps/UserContext';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import apiClient from 'src/api/axiosClient';
import PaymentAddMoney from 'src/modals/PaymentAddMoney';
import defaultProfilePic from 'src/assets/images/backgrounds/download.png';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [openAddWalletModal, setOpenAddWalletModal] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  function openAddMoneyInWalletModal() {
    setOpenAddWalletModal(() => true);
  }

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await apiClient.get('/wallet/');
        if (response.status === 200) {
          setWalletBalance(response.data.data.balance);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    const fetchApiStatus = async () => {
      try {
        const phoneId = localStorage.getItem('phone_id');
        const token = localStorage.getItem('access_meta');
        if (phoneId) {
          const response = await apiClient.get(`/auth/api_status/?phone_id=${phoneId}`, {
            headers: {
              'Access-Token': token,
            },
          });
          if (response.status === 200) {
            setApiStatus(response.data.api_status || '-');
          } else {
            setApiStatus('-');
          }
        } else {
          setApiStatus('-');
        }
      } catch (error) {
        console.error('Error fetching API status:', error);
        setApiStatus('-');
      }
    };

    fetchWalletBalance();
    fetchApiStatus();
  }, []);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <>
      <Stack direction={'row'} alignItems="center">
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#545557',
            display: { xs: 'none', sm: 'none', md: 'block' },
          }}
        >
          WhatsApp Business API Status:
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#545557',
            display: { xs: 'block', sm: 'block', md: 'none' },
          }}
        >
          WABA Status:
        </Typography>
        {apiStatus === null ? (
          <Skeleton variant="text" width={50} height={30} animation={'wave'} />
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: '#1A4D2E',
            }}
            marginLeft="0.70rem"
          >
            {apiStatus || '-'}
          </Typography>
        )}
      </Stack>
      <Stack
        direction={'row'}
        spacing={2}
        alignItems="flex-start"
        sx={{
          marginLeft: {
            lg: '100px',
            xl: '100px',
            sm: '0px',
            md: '50px',
          },
        }}
      >
        {/* <Typography variant="h5" sx={{ fontWeight: 500, color: '#545557' }}>
          Wallet
        </Typography> */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#545557',
            cursor: 'pointer',
            '&:hover': {
              color: '#1A4D2E',
            },
          }}
        >
          <Tooltip title="Wallet">
            <AccountBalanceWalletIcon
              onClick={openAddMoneyInWalletModal}
              disabled={location.pathname === '/payment'}
              sx={{
                color: location.pathname === '/payment' ? 'gray' : 'inherit',
                pointerEvents: location.pathname === '/payment' ? 'none' : 'auto',
              }}
            />
          </Tooltip>
        </Typography>
        {walletBalance === null ? (
          <Skeleton variant="text" width={50} height={30} animation={'wave'} />
        ) : (
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, color: '#545557', marginLeft: '10px !important' }}
          >
            ₹{walletBalance}
          </Typography>
        )}
      </Stack>
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
            {user && user.full_name ? user.full_name.charAt(0).toUpperCase() : ''}
          </Avatar>
        </IconButton>
        {/* <IconButton
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
            src={user?.profile_pic || defaultProfilePic} // Check if the user has a profile picture
            sx={{
              width: 35,
              height: 35,
              backgroundColor: 'primary.main',
            }}
          >
            {!user?.profile_pic && (user?.full_name ? user.full_name.charAt(0).toUpperCase() : '')}
          </Avatar>
        </IconButton> */}

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
                    localStorage.clear();

                    handleClose2();
                    window.location.reload();
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
      <PaymentAddMoney
        open={openAddWalletModal}
        setOpenAddWalletModal={setOpenAddWalletModal}
        walletBalance={walletBalance}
      />
    </>
  );
};

export default Profile;
