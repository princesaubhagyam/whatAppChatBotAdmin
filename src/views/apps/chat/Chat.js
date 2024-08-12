import React, { useEffect, useState } from 'react';
import { Divider, Box } from '@mui/material';

import PageContainer from '../../../components/container/PageContainer';
import ChatSidebar from '../../../components/apps/chats/ChatSidebar';
import ChatContent from '../../../components/apps/chats/ChatContent';
import ChatMsgSent from '../../../components/apps/chats/ChatMsgSent';
import apiClient from 'src/api/axiosClient';
import AppCard from 'src/components/shared/AppCard';
import ChatSidebarMember from '../../../components/apps/chats/ChatSidebarMember';
import Spinner from '../../../views/spinner/Spinner';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setBroadcastList } from 'src/store/apps/chat/ChatSlice';
import Analytics from '../../../components/analytics/Analytics';

export const getBroadcastsData = async () => {
  try {
    const response = await apiClient.get('/api/broadcasts/');
    return response.data.data.results;
  } catch (error) {
    toast.error('Error fetching data from API:', error);
  }
};

const Chats = ({ checkBroadcastHistory }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [isAnalytics, setIsAnalytics] = useState(false);
  const broadcasts = useSelector((state) => state.chatReducer.broadcasts);
  const broadcastsFromRedux = useSelector((state) => state.chatReducer.broadcasts);
  const getBroadcastList = async () => {
    setLoading(true);
    const broadcastsRes = await getBroadcastsData();
    // setBroadcasts(broadcastsRes);
    dispatch(setBroadcastList(broadcastsRes));
    setLoading(false);
  };

  useEffect(() => {
    getBroadcastList();
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
          {isAnalytics ? (
            <Analytics setIsAnalytics={setIsAnalytics} />
          ) : (
            <>
              <ChatSidebar
                isMobileSidebarOpen={isMobileSidebarOpen}
                onSidebarClose={() => setMobileSidebarOpen(false)}
                broadcasts={broadcasts}
                getBroadcastsData={getBroadcastList}
                sx={{ flex: '0 1 300px', overflowY: 'auto' }}
              />
              <Box
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' /*height: '85vh'*/ }}
              >
                <ChatContent
                  toggleChatSidebar={() => setMobileSidebarOpen(true)}
                  sx={{ flexGrow: 1 }}
                  checkBroadcastHistory={checkBroadcastHistory}
                  setIsAnalytics={setIsAnalytics}
                />
                <Divider />
                <ChatMsgSent checkBroadcastHistory={checkBroadcastHistory} />
              </Box>
              <ChatSidebarMember
                sx={{ flex: '0 1 300px', overflowY: 'auto' }}
                getBroadcastList={getBroadcastList}
              />
            </>
          )}
        </AppCard>
      </PageContainer>
      {/* <BroadcastTableList broadcasts={broadcasts} /> */}
    </>
  );
};

export default Chats;