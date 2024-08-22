import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, InputBase, Box, Button } from '@mui/material';
import { IconSend, IconUserPlus } from '@tabler/icons';
import { sendMsg, updateActiveBroadcast } from 'src/store/apps/chat/ChatSlice';
import TemplateModal from 'src/modals/TemplateModal';
import BroadcastMemberModal from 'src/modals/BroadcastMemberModal';
import apiClient from 'src/api/axiosClient';
import EventContext from 'src/BroadcastContext';

const ChatMsgSent = ({
  checkBroadcastHistory,
  memberCount,
  getBroadcastList,
  onUpdateMembers,
  isHistory,
}) => {
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false); // State for BroadcastMemberModal
  // const [isHistory, setIsHistory] = useState(false);
  // const { isOn } = useContext(EventContext);
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const id = useSelector((state) => state.chatReducer.chatId);

  // useEffect(() => {
  //   if (activeBroadcast) {
  //     apiClient
  //       .get(`/broadcast-history_checker/${activeBroadcast.id}/`)
  //       .then((response) => {
  //         setIsHistory(response.data.is_history);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching history status:', error);
  //       });
  //   }
  // }, [activeBroadcast, isOn]);

  const handleOpenTemplateModal = () => {
    setOpenModal(true);
  };

  const handleCloseTemplateModal = () => {
    setOpenModal(false);
  };

  const handleOpenMemberModal = () => {
    setIsMemberModalOpen(true);
  };

  const handleCloseMemberModal = () => {
    setIsMemberModalOpen(false);
  };

  const handleUpdateMembers = (updatedMembers) => {
    console.log('Updated Members:', updatedMembers);
    getBroadcastList(); // Ensure the broadcast list is refreshed
    onUpdateMembers(updatedMembers); // Update members in the parent component
    dispatch(updateActiveBroadcast(activeBroadcast.id, { members: updatedMembers }));
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
          {/* {!isHistory && (
            <div style={{ justifyContent: 'center' }}>
              {memberCount > 0 ? (
                <Button
                  style={{ backgroundColor: '#1A4D2E', color: 'white' }}
                  onClick={handleOpenTemplateModal}
                  sx={{ height: '30px' }}
                >
                  <IconSend size={16} />
                  Send Template
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: '#1A4D2E', color: 'white' }}
                  onClick={handleOpenMemberModal} // Open member modal
                  sx={{ height: '30px' }}
                >
                  <IconUserPlus size={16} />
                  Add Member
                </Button>
              )}
            </div>
          )} */}
          {!isHistory && (
            <Button
              style={{ backgroundColor: '#1A4D2E', color: 'white' }}
              onClick={handleOpenTemplateModal}
              sx={{ height: '30px' }}
            >
              <IconSend size={16} />
              Send Template
            </Button>
          )}
        </form>
      )}
      <TemplateModal
        open={openModal}
        handleClose={handleCloseTemplateModal}
        broadcastId={activeBroadcast?.id}
        checkBroadcastHistory={checkBroadcastHistory}
      />
      <BroadcastMemberModal
        open={isMemberModalOpen}
        handleClose={handleCloseMemberModal}
        activeBroadcastId={activeBroadcast?.id}
        getBroadcastList={getBroadcastList}
        activeBroadcast={activeBroadcast}
        onUpdateMembers={handleUpdateMembers}
      />
    </Box>
  );
};

export default ChatMsgSent;
