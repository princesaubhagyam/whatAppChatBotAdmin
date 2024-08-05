import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, InputBase, Box, Popover, Button } from '@mui/material';
import { IconSend } from '@tabler/icons';
import { sendMsg } from 'src/store/apps/chat/ChatSlice';
import TemplateModal from 'src/modals/TemplateModal';
import axios from 'axios';
import apiClient from 'src/api/axiosClient';
import EventContext from 'src/BroadcastContext';

const ChatMsgSent = ({ checkBroadcastHistory }) => {
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const { isOn } = useContext(EventContext);
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const id = useSelector((state) => state.chatReducer.chatId);
   
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
  }, [activeBroadcast , isOn]);

  const onEmojiClick = (_event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setMsg(emojiObject.emoji);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChatMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const newMsg = { id, msg };

  const onChatMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(sendMsg(newMsg));
    setMsg('');
  };

  return (
    <Box sx={{ height: { lg: '39px !important', xl: '39px !important', md: '39px !important' } }}>
      {/* ------------------------------------------- */}
      {/* sent chat */}
      {/* ------------------------------------------- */}
      {activeBroadcast && (
        <form
          onSubmit={onChatMsgSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            padding: '9.6px',
            backgroundColor: 'white',
            height: '40px',
          }}
        >
          {/* ------------------------------------------- */}
          {/* Emoji picker */}
          {/* ------------------------------------------- */}
          {/* <IconButton
            aria-label="more"
            id="long-button"
            aria-controls="long-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <IconMoodSmile />
          </IconButton> */}
          {/* <Popover
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Picker onEmojiClick={onEmojiClick} native />
            <Box p={2}>Selected: {chosenEmoji ? chosenEmoji.emoji : ''}</Box>
          </Popover> */}
          {/* <InputBase
            id="msg-sent"
            fullWidth
            value={msg}
            placeholder="Type a Message"
            size="small"
            type="text"
            inputProps={{ 'aria-label': 'Type a Message' }}
            onChange={handleChatMsgChange.bind(null)}
          />
          <IconButton
            aria-label="send"
            onClick={() => {
              dispatch(sendMsg({ msg: newMsg.msg, phoneNo: activeChatPhoneNo }));
              setMsg('');
            }}
            disabled={!msg}
            color="primary"
          >
            <IconSend stroke={1.5} size="20" />
          </IconButton>
          <IconButton aria-label="delete">
            <IconPhoto stroke={1.5} size="20" />
          </IconButton>
          <IconButton aria-label="delete">
            <IconPaperclip stroke={1.5} size="20" />
          </IconButton> */}
          {!isHistory && (
            <div style={{ justifyContent: 'center' }}>
              <Button
                style={{ backgroundColor: '#1A4D2E', color: 'white' }}
                onClick={handleOpenModal}
                sx={{ height: '30px'}}
              >
                <IconSend size={16} />
                Send Template
              </Button>
            </div>
          )}
        </form>
      )}
      <TemplateModal
        open={openModal}
        handleClose={handleCloseModal}
        broadcastId={activeBroadcast?.id}
        checkBroadcastHistory={checkBroadcastHistory}
      />
    </Box>
  );
};

export default ChatMsgSent;
