import React, { useState } from 'react';
import {
  IconApps,
  IconBroadcast,
  IconCalendarEvent,
  IconChevronDown,
  IconChevronUp,
  IconGridDots,
  IconHome,
  IconMail,
  IconMan,
  IconMessages,
  IconSettings,
  IconSettingsAutomation,
  IconTemplate,
  
} from '@tabler/icons';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

import { Link } from 'react-router-dom';
import AppLinks from './AppLinks';
import QuickLinks from './QuickLinks';

const MobileRightSidebar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const cartContent = (
    <Box>
      {/* ------------------------------------------- */}
      {/* Apps Content */}
      {/* ------------------------------------------- */}
      <Box px={1}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton component={Link} to="/home">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconHome size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Home
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/contacts">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMan size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Contacts
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/broadcasts">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconBroadcast size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Broadcasts
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/templates">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconTemplate size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Templates
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconSettings size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Settings
              </Typography>
            </ListItemText>
          </ListItemButton>
          {/* <ListItemButton onClick={handleClick}>
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconApps size="21" stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Apps
              </Typography>
            </ListItemText>
            {open ? (
              <IconChevronDown size="21" stroke="1.5" />
            ) : (
              <IconChevronUp size="21" stroke="1.5" />
            )}
          </ListItemButton> */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box px={4} pt={3} overflow="hidden">
              {/* <AppLinks /> */}
            </Box>
          </Collapse>
        </List>
      </Box>

      <Box px={3} mt={3}>
        {/* <QuickLinks /> */}
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
        <IconGridDots size="21" stroke="1.5" />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Cart Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { width: '300px' } }}
      >
        <Box p={3} pb={0}>
          <Typography variant="h5" fontWeight={600}>
            Navigation
          </Typography>
        </Box>

        {/* component */}
        {cartContent}
      </Drawer>
    </Box>
  );
};

export default MobileRightSidebar;
