import React, { useEffect, useState } from 'react';
import {
  Avatar,
  List,
  ListItemText,
  ListItemAvatar,
  Box,
  Alert,
  Badge,
  ListItemButton,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '../../custom-scroll/Scrollbar';
import { selectBroadcast } from '../../../store/apps/chat/ChatSlice';
import { last } from 'lodash';
import {
  IconSearch,
  IconFileImport,
  IconPlus,
  IconUsers,
} from '@tabler/icons';
import ImportBroadcastModal from 'src/modals/ImportBroadcastModal';

const ChatListing = ({ broadcasts }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatId);
  const [openImportModal, setOpenImportModal] = useState(false);

  const filterChats = (broadcasts, cSearch) => {
    if (broadcasts)
      return broadcasts.filter((t) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()),
      );

    return broadcasts;
  };

  const chats = useSelector((state) =>
    filterChats(state.chatReducer.chats, state.chatReducer.chatSearch),
  );

  const getDetails = (conversation) => {
    let displayText = '';

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.senderId === conversation?.id ? 'You: ' : '';
      const message = lastMessage.type === 'image' ? 'Sent a photo' : lastMessage.msg;
      displayText = `${sender}${message}`;
    }

    return displayText;
  };

  const lastActivity = (chat) => last(chat.messages)?.createdAt;

  const handleOpenImportModal = () => {
    setOpenImportModal(true);
  };

  const handleCloseImportModal = () => {
    setOpenImportModal(false);
  };

  return (
    <div style={{ borderRadius: 0, borderRight: '3px solid #e5eaef' }}>
      <Box
        px={2}
        py={1}
        borderRadius={0}
        borderTop={'3px solid #e5eaef'}
        borderBottom={'3px solid #e5eaef'}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: '12px' }}>
            <b style={{ fontSize: '1rem' }}>Your broadcasts</b>
            <br />
            View all broadcasts and it's analytics
          </Typography>
          <IconSearch size={'16'} />
          <Button
            sx={{
              height: '25px',
              width: '40px',
              minWidth: '40px',
              padding: '8px',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            <IconPlus size={'19'} />
          </Button>
          <Button
            sx={{
              height: '25px',
              width: '40px',
              minWidth: '40px',
              padding: '8px',
            }}
            onClick={handleOpenImportModal}
          >
            <IconFileImport size={'19'} />
          </Button>
        </Stack>
      </Box>
      <List sx={{ px: 0 }}>
        <Scrollbar
          sx={{
            height: { xl: '100vh', lg: 'calc(100vh - 100px)', md: '100vh' },
            maxHeight: '520px',
          }}
        >
          {broadcasts && broadcasts.length ? (
            broadcasts.map((chat) => (
              <Box borderBottom={'3px solid #e5eaef'} borderRadius={0} key={chat.id}>
                <ListItemButton
                  onClick={() => dispatch(selectBroadcast(chat))}
                  sx={{
                    py: 1,
                    px: 1,
                    alignItems: 'start',
                  }}
                  selected={activeChat === chat.id}
                >
                  <ListItemAvatar>
                    <Badge
                      color={
                        chat.status === 'online'
                          ? 'success'
                          : chat.status === 'busy'
                          ? 'error'
                          : chat.status === 'away'
                          ? 'warning'
                          : 'secondary'
                      }
                      variant="dot"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      overlap="circular"
                    >
                      <Avatar sx={{ width: 42, height: 42 }}>
                        <IconUsers size={25} />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={14}
                        lineHeight={1.3}
                      >
                        {chat.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle1" fontSize={13}>
                        {chat.members} members
                      </Typography>
                    }
                    secondaryTypographyProps={{
                      noWrap: true,
                    }}
                    sx={{ my: 0 }}
                  />
                  <Box sx={{ flexShrink: '0' }} mt={0.5}></Box>
                </ListItemButton>
              </Box>
            ))
          ) : (
            <Box m={2}>
              <Alert severity="error" variant="filled" sx={{ color: 'white' }}>
                No Contacts Found!
              </Alert>
            </Box>
          )}
        </Scrollbar>
      </List>
      <ImportBroadcastModal open={openImportModal} handleClose={handleCloseImportModal} />
    </div>
  );
};

export default ChatListing;
