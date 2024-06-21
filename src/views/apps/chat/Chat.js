import React, { useEffect, useState } from 'react';
import { Divider, Box } from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ChatSidebar from '../../../components/apps/chats/ChatSidebar';
import ChatContent from '../../../components/apps/chats/ChatContent';
import ChatMsgSent from '../../../components/apps/chats/ChatMsgSent';
import apiClient from 'src/api/axiosClient';
import AppCard from 'src/components/shared/AppCard';
import ChatSidebarMember from '../../../components/apps/chats/ChatSidebarMember';
import Spinner from '../../../views/spinner/Spinner';

const Chats = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);

  const getBroadcastsData = async () => {
    try {
      const response = await apiClient.get('/api/broadcasts/');
      setBroadcasts(response.data.data.results);
      return;
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  useEffect(() => {
    getBroadcastsData();
  }, []);

  return (
    <>
      {/* <Spinner/> */}
      {/* <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}> */}
      <PageContainer
        title="Broadcasts"
        description="This is the Chat page"
        sx={{
          maxHeight: '60vh !important',
          padding: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 10,
        }}
      >
        {/* <Breadcrumb title="Broadcasts" subtitle="Broadcasts list" /> */}
        <AppCard sx={{ display: 'flex', flexGrow: 1, flexDirection: 'row', overflow: 'hidden' }}>
          {/* ------------------------------------------- */}
          {/* Left part */}
          {/* ------------------------------------------- */}
          <ChatSidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)}
            broadcasts={broadcasts}
            sx={{ flex: '0 1 300px', overflowY: 'auto' }}
          />
          {/* ------------------------------------------- */}
          {/* Right part */}
          {/* ------------------------------------------- */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '85vh' }}>
            <ChatContent
              toggleChatSidebar={() => setMobileSidebarOpen(true)}
              sx={{ flexGrow: 1 }}
            />
            <Divider />
            <ChatMsgSent />
          </Box>
          {/* ------------------------------------------- */}
          {/* Left part */}
          {/* ------------------------------------------- */}
          <ChatSidebarMember sx={{ flex: '0 1 300px', overflowY: 'auto' }} />
        </AppCard>
      </PageContainer>
      {/* </Box> */}
    </>
  );
};

export default Chats;
