import React from 'react';
import { Drawer, useMediaQuery } from '@mui/material';
import ChatListing from './ChatListing';

const drawerWidth = 320;

const ChatSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  broadcasts,
  getBroadcastsData,
  onBroadcastDelete,
  onBroadcastSelect,
  isHistory,
  setIsBroadcastDeleted,
  isBroadcastDeleted
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Drawer
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant={lgUp ? 'permanent' : 'temporary'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: lgUp ? 0 : 1,
        [`& .MuiDrawer-paper`]: { position: 'relative' },
        height: '100vh',
      }}
    >
      <ChatListing
        broadcasts={broadcasts}
        getBroadcastsData={getBroadcastsData}
        onBroadcastDelete={onBroadcastDelete}
        onBroadcastSelect={onBroadcastSelect}
        isHistory={isHistory}
        setIsBroadcastDeleted= {setIsBroadcastDeleted}
        isBroadcastDeleted = {isBroadcastDeleted}
      />
    </Drawer>
  );
};

export default ChatSidebar;
