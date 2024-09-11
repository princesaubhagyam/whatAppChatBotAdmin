import React, { useEffect, useState } from 'react';
import {
  Avatar,
  List,
  ListItemText,
  ListItemAvatar,
  Box,
  Badge,
  ListItemButton,
  Typography,
  Button,
  Stack,
  InputAdornment,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutline } from '@mui/icons-material';
import Scrollbar from '../../custom-scroll/Scrollbar';
import { IconEdit, IconFileImport, IconSearch } from '@tabler/icons';
import BroadcastMemberModal from 'src/modals/BroadcastMemberModal';
import ImportBroadcastMember from 'src/modals/ImportBroadcastMember';
import { fetchSelectedBroadcasts } from 'src/store/apps/chat/ChatSlice';
import { updateActiveBroadcast } from 'src/store/apps/chat/ChatSlice';
import Nodatainsearch from 'src/components/noData/Nodatainsearch';
import { FirstLetterCapitalOfString } from 'src/utils/FirstLetterCapitalOfString';
import apiClient from 'src/api/axiosClient';

const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  const initials = words.map((word) => word[0]).join('');
  return initials.toUpperCase();
};

const ChatListingMember = ({
  getBroadcastList,
  // refresh,
  // handleRefreshChatListingMember,
  setCallFunctionWhileDeleting,
  isHistory,
}) => {
  const dispatch = useDispatch();
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupMembers, setGroupMembers] = useState(activeBroadcast.contacts);
  const [currentIdOfMembers, setCurrentIdOfMembers] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [members, setMembers] = useState(activeBroadcast?.contacts || []);
  // const [memberCount, setMemberCount] = useState(activeBroadcast?.members || 0);
  // const isHistory = useSelector((state) => state.chatReducer.isHistory);
  // const { isOn } = useContext(EventContext);

  // useEffect(() => {
  //   if (activeBroadcast) {
  //     dispatch(fetchIsHistoryStatus(activeBroadcast.id));
  //   }
  // }, [activeBroadcast, isOn]);

  useEffect(() => {
    // console.log('Active broadcast updated:');
    setGroupMembers(activeBroadcast?.contacts);
  }, [activeBroadcast]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterChanged();
  };

  // const handleUpdateMembers = (updatedMembers) => {
  //   setMembers(updatedMembers);
  //   setMemberCount(updatedMembers.length);
  //   // Dispatch an action to update the activeBroadcast state
  //   dispatch(fetchSelectedBroadcasts(activeBroadcast.id));
  //   // dispatch(
  //   //   updateActiveBroadcast({
  //   //     ...activeBroadcast,
  //   //     contacts: updatedMembers,
  //   //   }),
  //   // );
  // };
  const handleUpdateMembers = (updatedMembers) => {
    dispatch(
      updateActiveBroadcast({
        ...activeBroadcast,
        contacts: updatedMembers,
        members: updatedMembers.length,
      }),
    );

    dispatch(fetchSelectedBroadcasts(activeBroadcast.id));
  };

  async function deleteMember() {
    setLoading(true);
    try {
      const resp = await apiClient.delete(
        `api/remove_contact_broadcast/?contact_id=${currentIdOfMembers}&broadcast_id=${activeBroadcast.id}`,
      );
      if (resp.data.status) {
        dispatch(fetchSelectedBroadcasts(activeBroadcast.id));
        setOpenDeleteDialog(false);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setOpenDeleteDialog(false);
      setLoading(false);
    }
  }

  function getCurentID(member) {
    setCurrentIdOfMembers(member.id);
    setOpenDeleteDialog(true);
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // const filteredMembers = activeBroadcast?.contacts?.filter(
  //   (member) =>
  //     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     member.full_mobile.includes(searchQuery),
  // );
  function filterChanged() {
    if (!searchQuery) {
      setGroupMembers(activeBroadcast?.contacts);
    } else {
      setGroupMembers(
        activeBroadcast?.contacts?.filter(
          (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.full_mobile.includes(searchQuery),
        ),
      );
    }
  }

  return (
    <>
      {activeBroadcast && (
        <div style={{ borderRadius: 0, borderLeft: '3px solid #e5eaef' }}>
          <Box
            px={2}
            py={1}
            borderRadius={0}
            borderTop={'3px solid #e5eaef'}
            borderBottom={'3px solid #e5eaef'}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography style={{ fontSize: '12px' }}>
                <b style={{ fontSize: '1rem' }}>Members</b>
                <br />
                {activeBroadcast.members} members
              </Typography>
              <Stack direction="row" gap={1}>
                {!isHistory && (
                  <>
                    <Tooltip title="Add members">
                      <Button
                        sx={{
                          height: '25px',
                          width: '40px',
                          minWidth: '40px',
                          padding: '8px',
                        }}
                        onClick={() => setIsMemberModalOpen(true)}
                      >
                        <IconEdit size={'20'} />
                      </Button>
                    </Tooltip>

                    <Tooltip title="Add member from CSV">
                      <Button
                        sx={{
                          height: '25px',
                          width: '40px',
                          minWidth: '40px',
                          padding: '8px',
                        }}
                        onClick={() => setIsImportModalOpen(true)}
                      >
                        <IconFileImport size={'19'} />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </Stack>
            <TextField
              fullWidth
              size="small"
              placeholder="Search members..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 0, borderRadius: 4 }}
            />
          </Box>
          <List sx={{ px: 0 }}>
            <Scrollbar sx={{ height: { lg: '70vh !important', md: '100vh' }, maxHeight: '550px' }}>
              {groupMembers && groupMembers.length > 0 ? (
                groupMembers.map((member) => (
                  <Box borderBottom={'3px solid #e5eaef'} borderRadius={0} key={member.id}>
                    <ListItemButton
                      sx={{
                        mb: 0.5,
                        py: 1,
                        px: 1,
                        alignItems: 'start',
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color={
                            member.status === 'online'
                              ? 'success'
                              : member.status === 'busy'
                              ? 'error'
                              : member.status === 'away'
                              ? 'warning'
                              : 'secondary'
                          }
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          overlap="circular"
                        >
                          <Avatar sx={{ width: 42, height: 42 }}>{getInitials(member.name)}</Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            fontSize={14}
                            lineHeight={1.3}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            {FirstLetterCapitalOfString(member.name)}
                            {!isHistory && (
                              <Tooltip title="Delete Member">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => getCurentID(member)}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="subtitle1" fontSize={13}>
                            {member.full_mobile}
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
                  <Nodatainsearch />
                </Box>
              )}
            </Scrollbar>
          </List>
        </div>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="confirm-delete-dialog"
        sx={{ height: '40%' }}
      >
        <DialogTitle id="alert-dialog-title">{'Delete Member'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={deleteMember}
            autoFocus
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <BroadcastMemberModal
        open={isMemberModalOpen}
        handleClose={() => setIsMemberModalOpen(false)}
        activeBroadcastId={activeBroadcast?.id}
        getBroadcastList={getBroadcastList}
        activeBroadcast={activeBroadcast}
        onUpdateMembers={handleUpdateMembers}
      />
      <ImportBroadcastMember
        open={isImportModalOpen}
        handleClose={() => setIsImportModalOpen(false)}
        activeBroadcastId={activeBroadcast?.id}
        getBroadcastList={getBroadcastList}
      />
    </>
  );
};

export default ChatListingMember;
