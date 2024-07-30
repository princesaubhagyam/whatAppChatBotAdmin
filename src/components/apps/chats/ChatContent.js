import React from 'react';
import {
  Typography,
  Divider,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Stack,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { IconMenu2 } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNowStrict } from 'date-fns';
import CachedIcon from '@mui/icons-material/Cached';
import { useState } from 'react';
//import ChatInsideSidebar from './ChatInsideSidebar';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { fetchChatHistoryByPhoneNo } from '../../../store/apps/chat/ChatSlice';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import MessageList from './MessageList'; // Import the new component
import Spinner from 'src/views/spinner/Spinner';
import { useEffect } from 'react';
import apiClient from 'src/api/axiosClient';
const ChatContent = ({ toggleChatSidebar }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [loading, setLoading] = useState(false);
  const chatDetails = useSelector((state) => state.chatReducer.chatHistory);
  const [refreshKey, setRefreshKey] = useState(0);
  console.log('chatDetails', activeBroadcast);
  const [isHistory, setIsHistory] = useState(false);
  useEffect(() => {
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
  }, [activeBroadcast]);
  const refreshChatHistory = async () => {
    setLoading(true);
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <Box>
      {activeBroadcast ? (
        <>
          <Box borderTop={'3px solid #e5eaef'} borderRadius={0} /*height={'75vh !important'}*/>
            <Box>
              <Box display="flex" alignItems="center" p={1.2}>
                <Box
                  sx={{
                    display: { xs: 'block', md: 'block', lg: 'none' },
                    mr: '10px',
                  }}
                >
                  <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
                </Box>
                <ListItem key={activeBroadcast.id} dense disableGutters>
                  <ListItemText
                    style={{ padding: '0px' }}
                    primary={<Typography variant="h5">{activeBroadcast.title}</Typography>}
                  />
                  <IconButton sx={{ cursor: 'pointer' }}>
                    {!isHistory && (
                      <CachedIcon
                        fontSize="medium"
                        sx={{ marginRight: '2px' }}
                        onClick={refreshChatHistory}
                      />
                    )}
                  </IconButton>
                </ListItem>
                <Stack direction={'row'}></Stack>
              </Box>
              <Divider />
            </Box>
            <Box display="flex">
              <Box
                width="100%"
                sx={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  overflowY: 'hidden',
                  zIndex: '100',
                  height: { xl: '72vh !important', lg: '70vh !important', md: '85vh !important' },
                  maxHeight: '500px',
                  borderRadius: '0px !important',
                }}
              >
                <Scrollbar
                  sx={{
                    height: { xl: '100vh', lg: 'calc(100vh - 100px)', md: '100vh' },
                    maxHeight: '500px',
                    //overflowY: 'scroll',
                  }}
                >
                  <Box p={3} display={'flex'} justifyContent={'end'}>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <MessageList id={activeBroadcast?.id} refreshKey={refreshKey} />
                        {chatDetails?.map((chat) => (
                          <Box key={chat.id + chat.msg}>
                            <Box display="flex">
                              <ListItemAvatar>
                                <Avatar
                                  alt={activeBroadcast}
                                  src={chatDetails.thumb}
                                  sx={{ width: 40, height: 40 }}
                                />
                              </ListItemAvatar>
                              <Box>
                                {chat.createdAt ? (
                                  <Typography variant="body2" color="grey.400" mb={1}>
                                    {chatDetails.name},{' '}
                                    {formatDistanceToNowStrict(new Date(chat.createdAt), {
                                      addSuffix: false,
                                    })}{' '}
                                    ago
                                  </Typography>
                                ) : null}
                                <Box
                                  mb={2}
                                  sx={{
                                    p: 1,
                                    backgroundColor: 'grey.100',
                                    mr: 'auto',
                                    maxWidth: '320px',
                                  }}
                                >
                                  {chat.message}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                </Scrollbar>
              </Box>
              {/* <ChatInsideSidebar isInSidebar={lgUp ? open : !open} chat={chatDetails} /> */}
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ChatContent;
