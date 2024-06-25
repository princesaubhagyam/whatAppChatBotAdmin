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
import toast, { Toaster } from 'react-hot-toast';

const Chats = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBroadcastsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/broadcasts/');
      setBroadcasts(response.data.data.results);
    } catch (error) {
      toast.error('Error fetching data from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBroadcastsData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
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
        <AppCard sx={{ display: 'flex', flexGrow: 1, flexDirection: 'row', overflow: 'hidden' }}>
          <ChatSidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)}
            broadcasts={broadcasts}
            getBroadcastsData={getBroadcastsData} 
            sx={{ flex: '0 1 300px', overflowY: 'auto' }}
          />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '85vh' }}>
            <ChatContent
              toggleChatSidebar={() => setMobileSidebarOpen(true)}
              sx={{ flexGrow: 1 }}
            />
            <Divider />
            <ChatMsgSent />
          </Box>
          <ChatSidebarMember sx={{ flex: '0 1 300px', overflowY: 'auto' }} />
        </AppCard>
      </PageContainer>
    </>
  );
};

export default Chats;
