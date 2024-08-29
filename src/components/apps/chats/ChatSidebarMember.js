import React from 'react';
import { Drawer, useMediaQuery } from '@mui/material';
import ChatListing from './ChatListing';
import ChatListingMember from './ChatListingMember';

const drawerWidth = 320;

const ChatSidebarMember = ({
  isMobileSidebarOpen,
  onSidebarClose,
  contacts,
  getBroadcastList,
  isHistory,
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Drawer
      //open={isMobileSidebarOpen}
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
      {/* <ChatListingMember contacts={contacts} /> */}
      <ChatListingMember getBroadcastList={getBroadcastList} isHistory={isHistory} />
    </Drawer>
  );
};

export default ChatSidebarMember;
