import React, { useContext, useEffect, useState } from 'react';
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
import BroadcastPayHistory from "../../../components/broadcastPayHistory/BroadcastPayHistory"
import EventContext from 'src/BroadcastContext';

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
  const [broadcastPayHistroy, setBroadcastPayHistroy] = useState(false);
  const broadcasts = useSelector((state) => state.chatReducer.broadcasts);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [isBroadcastDeleted, setIsBroadcastDeleted] = useState(false);
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);


  const [isHistory, setIsHistory] = useState(false);
  const { isOn } = useContext(EventContext);

  useEffect(() => {
    historyChecker();
  }, [activeBroadcast, isOn]);

  function historyChecker() {
    if (activeBroadcast) {
      apiClient
        .get(`/broadcast-history_checker/${activeBroadcast.id}/`)
        .then((response) => {
          setIsHistory(response.data.is_history);
        })
        .catch((error) => {
          console.error('Error fetching history status:', error);
        });
    }
  }

  //useEffect(() => {}, []);

  const getBroadcastList = async () => {
    setLoading(true);
    const broadcastsRes = await getBroadcastsData();
    dispatch(setBroadcastList(broadcastsRes));
    setLoading(false);
  };

  useEffect(() => {
    getBroadcastList();
  }, []);

  useEffect(() => {
    if (selectedBroadcast) {
      setIsBroadcastDeleted(false);
    }
  }, [selectedBroadcast]);

  const handleBroadcastDelete = () => {
    setIsBroadcastDeleted(true);
    setSelectedBroadcast(null);
  };

  useEffect(() => {
    if (selectedBroadcast) {
      setSelectedBroadcast({ ...selectedBroadcast });
    }
  }, [broadcasts]);

  const handleBroadcastSelect = (broadcast) => {
    setSelectedBroadcast(broadcast);
    setIsBroadcastDeleted(false);
  };
  useEffect(() => {
    setIsBroadcastDeleted(true);
  }, [window.location.pathname]);
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
          ) : broadcastPayHistroy ? <> <BroadcastPayHistory setBroadcastPayHistroy = {setBroadcastPayHistroy} /></> : (
            <>
              <ChatSidebar
                isMobileSidebarOpen={isMobileSidebarOpen}
                onSidebarClose={() => setMobileSidebarOpen(false)}
                broadcasts={broadcasts}
                getBroadcastsData={getBroadcastList}
                sx={{ flex: '0 1 300px', overflowY: 'auto' }}
                onBroadcastDelete={handleBroadcastDelete}
                onBroadcastSelect={handleBroadcastSelect}
                isHistory={isHistory}
                setIsBroadcastDeleted= {setIsBroadcastDeleted}
                isBroadcastDeleted = {isBroadcastDeleted}
              />
              {!isBroadcastDeleted && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <ChatContent
                    toggleChatSidebar={() => setMobileSidebarOpen(true)}
                    sx={{ flexGrow: 1 }}
                    checkBroadcastHistory={checkBroadcastHistory}
                    setIsAnalytics={setIsAnalytics}
                    setBroadcastPayHistroy ={setBroadcastPayHistroy}
                    isHistory={isHistory}
                  />
                  <Divider />
                  {broadcasts && <ChatMsgSent
                    checkBroadcastHistory={checkBroadcastHistory}
                    memberCount={broadcasts?.members}
                    getBroadcastsData={getBroadcastList}
                    isHistory={isHistory}
                  />}

                </Box>
              )}
              {!isBroadcastDeleted && (
                <ChatSidebarMember
                  sx={{ flex: '0 1 300px', overflowY: 'auto' }}
                  getBroadcastList={getBroadcastList}
                  isHistory={isHistory}
                />
              )}
            </>
          )}
        </AppCard>
      </PageContainer>
    </>
  );
};

export default Chats;
