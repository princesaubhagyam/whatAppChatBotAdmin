import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, InputBase, Box, Popover, Button } from '@mui/material';
import Picker from 'emoji-picker-react';
import { IconMoodSmile, IconPaperclip, IconPhoto, IconSend } from '@tabler/icons';
import { sendMsg } from 'src/store/apps/chat/ChatSlice';
import TemplateModal from 'src/modals/TemplateModal';
import { useState } from 'react';

const ChatMsgSent = () => {
  const [msg, setMsg] = React.useState('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chosenEmoji, setChosenEmoji] = React.useState();
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [openModal, setOpenModal] = useState(false);

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

  const id = useSelector((state) => state.chatReducer.chatId);

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
    <Box sx={{ height: '82vh' }}>
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
            height: '65px'
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
          <div style={{ justifyContent: 'center' }}>
            <Button
              style={{ backgroundColor: '#1A4D2E', color: 'white' }}
              onClick={handleOpenModal}
            >
              <IconSend size={16} />
              Send Template
            </Button>
          </div>
        </form>
      )}
      <TemplateModal
        open={openModal}
        handleClose={handleCloseModal}
        broadcastId={activeBroadcast?.id}
      />
    </Box>
  );
};

export default ChatMsgSent;
