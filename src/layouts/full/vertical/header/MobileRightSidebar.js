import React, { useState } from 'react';
import {
  IconBroadcast,
  IconCreditCard,
  IconGridDots,
  IconHome,
  IconMan,
  IconTemplate,
  IconUser,
} from '@tabler/icons';
import LogoImg from 'src/assets/images/logos/home_logo.png';

import {
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';

import { Link } from 'react-router-dom';

const MobileRightSidebar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (index) => {
    // console.log('Item clicked:', index);
    setSelectedIndex(index);
    setShowDrawer(false);
  };
  const cartContent = (
    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100vh" px={1}>
      {/* Top Section - Main Links */}
      <Box>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            component={Link}
            to="/home"
            onClick={() => handleListItemClick(0)}
            selected={selectedIndex === 0}
            sx={{
              backgroundColor: selectedIndex === 0 ? '#BFDCC2 !important' : 'inherit',
              color: selectedIndex === 0 ? '#2A5A3C !important' : 'inherit',
              '& .MuiListItemIcon-root': {
                color: selectedIndex === 0 ? '#2A5A3C !important' : 'inherit',
              },
              '&:hover': {
                backgroundColor: '#BFDCC2',
                color: '#2A5A3C',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 35, '&:hover': { color: '#2A5A3C' } }}>
              <IconHome size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                Dashboard
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/business-profile"
            sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconUser size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                B-Profile
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/contacts"
            sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMan size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                Contacts
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/broadcasts"
            sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconBroadcast size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                Broadcasts
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/templates"
            sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconTemplate size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                Templates
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/payment-history"
            sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconCreditCard size="23" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
                Pay History
              </Typography>
            </ListItemText>
          </ListItemButton>
        </List>
      </Box>

      {/* Bottom Section - Privacy & Terms */}
      <Box>
        <ListItemButton
          component={Link}
          to="/privacy-policy"
          sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
        >
          <ListItemIcon sx={{ minWidth: 35 }}>
            <IconCreditCard size="23" stroke="1.5" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
              Privacy Policy
            </Typography>
          </ListItemText>
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/terms-conditions"
          sx={{ '&:hover': { backgroundColor: '#BFDCC2', color: '#2A5A3C' } }}
        >
          <ListItemIcon sx={{ minWidth: 35 }}>
            <IconCreditCard size="23" stroke="1.5" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle2" fontWeight={600} fontSize="1rem">
              Terms & Conditions
            </Typography>
          </ListItemText>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box width={'100%'}>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => setShowDrawer(true)}
        sx={{
          ...(showDrawer && {
            color: 'primary.main',
          }),
        }}
      >
        <IconGridDots size="23" stroke="1.5" />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Cart Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { width: '250px' } }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src={LogoImg}
            alt="Logo"
            sx={{
              width: 50,
              height: 50,
              margin: '10px !important',
              borderRadius: '0px !important',
            }}
          />
          <Typography variant="h3" color={'primary.main'} fontWeight={600}>
            Saubhagyam
          </Typography>
        </Stack>

        {/* component */}
        {cartContent}
      </Drawer>
    </Box>
  );
};

export default MobileRightSidebar;
