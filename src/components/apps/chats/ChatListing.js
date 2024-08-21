import React, { useContext, useEffect, useState } from 'react';
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Modal,
  CircularProgress,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '../../custom-scroll/Scrollbar';

import { selectBroadcast, fetchIsHistoryStatus } from '../../../store/apps/chat/ChatSlice';
import { IconEdit, IconPlus, IconUsers } from '@tabler/icons';
import ImportBroadcastModal from 'src/modals/ImportBroadcastModal';
import { DeleteOutline } from '@mui/icons-material';
import EventContext from 'src/BroadcastContext';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import Nodatainsearch from 'src/components/noData/Nodatainsearch';
import { FullStringCapital } from 'src/utils/FullStringCapital';
import InfiniteScroll from 'react-infinite-scroll-component';

const ChatListing = ({ broadcasts, getBroadcastsData, onBroadcastDelete, onBroadcastSelect }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatId);
  const [openImportModal, setOpenImportModal] = useState(false);
  // const [broadcastData, setBroadcastData] = useState(broadcasts);
  const [broadcastData, setBroadcastData] = useState([]);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isOn } = useContext(EventContext);
  const [isBroadcastDeleted, setIsBroadcastDeleted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isHistory, setIsHistory] = useState(undefined);

  const [nextUrl, setNextUrl] = useState('/api/broadcasts/');
  const [hasMore, setHasMore] = useState(true);

  const [newBroadcastName, setNewBroadcastName] = useState('');
  useEffect(() => {
    if (selectedBroadcastId) {
      setIsHistory(undefined);
      apiClient
        .get(`/broadcast-history_checker/${selectedBroadcastId}/`)
        .then((response) => {
          setIsHistory(response.data.is_history);
        })
        .catch((error) => {
          console.error('Error fetching history status:', error);
        });
    }
  }, [selectedBroadcastId, isOn, broadcastData]);

  const handleOpenImportModal = () => {
    setOpenImportModal(true);
  };

  const handleCloseImportModal = () => {
    setOpenImportModal(false);
  };

  const handleBroadcastClick = (chat) => {
    dispatch(selectBroadcast(chat)); // Dispatch action to select the broadcast
    setSelectedBroadcastId(chat.id); // Update selected broadcast ID
    setSelectedBroadcast(chat); // Update selected broadcast object
    setIsBroadcastDeleted(false); // Ensure this is the correct state update
    onBroadcastSelect(chat); // Notify parent component
  };

  useEffect(() => {
    console.log('Broadcast data updated:', broadcasts);
  }, [broadcasts]);

  const getBroadcastsDataApi = async () => {
    if (nextUrl) {
      try {
        const response = await apiClient.get(nextUrl);
        const next = response.data.data.next;
        const results = response.data.data.results;
        setBroadcastData((prevData) => [...prevData, ...results]);
        setNextUrl(next);
        setHasMore(!!next);
      } catch (error) {
        toast.error('Error fetching data from API:', error);
      }
    }
  };

  useEffect(() => {
    getBroadcastsDataApi();
  }, [nextUrl]);
  const handleDeleteBroadcast = () => {
    if (selectedBroadcastId) {
      setLoading(true);
      apiClient
        .delete(`/api/broadcasts/${selectedBroadcastId}/`)
        .then((response) => {
          setBroadcastData(broadcastData.filter((chat) => chat.id !== selectedBroadcastId));
          setSelectedBroadcastId(null);
          setSelectedBroadcast(null);
          setLoading(false);
          setOpenDeleteDialog(false);
          toast.success('Deleted Successfully');
          getBroadcastsData();
          onBroadcastDelete(); // Notify parent component
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error deleting broadcast:', error);
        });
    }
  };

  const handleEditBroadcast = () => {
    if (newBroadcastName.trim() === selectedBroadcast?.title) {
      // If title hasn't changed, close the dialog without making any API calls
      setOpenEditDialog(false);
      //toast.success('No changes detected in the title.');
      console.log('no changes in your title');

      return;
    }
    if (selectedBroadcastId && newBroadcastName !== selectedBroadcast?.title) {
      setLoading(true);
      apiClient
        .patch(`/api/broadcasts/${selectedBroadcastId}/`, { title: newBroadcastName })
        .then((response) => {
          setBroadcastData(
            broadcastData.map((chat) =>
              chat.id === selectedBroadcastId ? { ...chat, title: newBroadcastName } : chat,
            ),
          );
          setLoading(false);
          setOpenEditDialog(false);
          toast.success('Edited Successfully');
          onBroadcastDelete(); // Notify parent component if needed
          getBroadcastsData(); // Refresh data
        })
        .catch((error) => {
          setLoading(false);

          toast.error('Error updating broadcast:', error);
        });
    }
  };
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleOpenEditDialog = () => {
    setNewBroadcastName(selectedBroadcast?.title || ''); // Set initial value
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
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
            View all broadcasts and its analytics
          </Typography>
          <Tooltip title="Create group ">
            <Button
              sx={{
                height: '25px',
                width: '40px',
                minWidth: '40px',
                padding: '8px',
              }}
              onClick={handleOpenImportModal}
            >
              <IconPlus size={'19'} />
            </Button>
          </Tooltip>
        </Stack>
      </Box>
      <List sx={{ px: 0 }}>
        <Scrollbar
          sx={{
            height: { lg: '75vh !important', md: '100vh' },
            maxHeight: '550px',
          }}
        >
          <InfiniteScroll
            dataLength={broadcastData.length}
            next={getBroadcastsDataApi}
            hasMore={hasMore}
            loader={
              <Box m={2}>
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            }
          >
            {broadcastData && broadcastData.length
              ? broadcastData.map((chat) => (
                  <Box
                    sx={{
                      borderBottom: '3px solid #e5eaef',
                      borderRadius: 0,
                      backgroundColor:
                        selectedBroadcastId === chat.id ? '#bdbcbc9e' : 'transparent',
                      '&:hover': { backgroundColor: '#bdbcbc9e !important' },
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: '10px',
                    }}
                    key={chat.id}
                  >
                    <ListItemButton
                      onClick={() => handleBroadcastClick(chat)}
                      sx={{
                        py: 1,
                        px: 1,
                        alignItems: 'start',
                        '&:hover': { backgroundColor: 'transparent !important' },
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
                            {FullStringCapital(chat.title)}
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
                    </ListItemButton>
                    {/* {selectedBroadcastId === chat.id && !isHistory && (
                  <IconButton size="small" color="error" onClick={handleOpenDeleteDialog}>
                    <DeleteOutline />
                  </IconButton>
                )}
                {selectedBroadcastId === chat.id && !isHistory && (
                  <IconButton size="small" color="primary" onClick={handleOpenEditDialog}>
                    <IconEdit />
                  </IconButton>
                )} */}
                    {selectedBroadcastId === chat.id && (
                      <>
                        {isHistory === undefined ? (
                          <>
                            <Skeleton
                              variant="circular"
                              width={30}
                              height={30}
                              sx={{ m: 1, bgcolor: 'transparent' }}
                            />
                            <Skeleton
                              variant="circular"
                              width={30}
                              height={30}
                              sx={{ m: 1, bgcolor: 'transparent' }}
                            />
                          </>
                        ) : (
                          !isHistory && (
                            <>
                              <Tooltip title="Delete group">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={handleOpenDeleteDialog}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit title">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={handleOpenEditDialog}
                                >
                                  <IconEdit />
                                </IconButton>
                              </Tooltip>
                            </>
                          )
                        )}
                      </>
                    )}
                  </Box>
                ))
              : !hasMore && (
                  <Box m={2}>
                    {/* <Alert severity="error" variant="filled" sx={{ color: 'white' }}>
                No Contacts Found!
              </Alert>  */}
                    <Nodatainsearch />
                  </Box>
                )}
          </InfiniteScroll>
        </Scrollbar>
      </List>
      <ImportBroadcastModal
        open={openImportModal}
        handleClose={handleCloseImportModal}
        getBroadcastsData={getBroadcastsData}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="confirm-delete-dialog"
        sx={{ height: '40%' }}
      >
        <DialogTitle id="alert-dialog-title">{'Delete Broadcast'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this broadcast?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteBroadcast}
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

      <Modal
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-broadcast-modal"
        aria-describedby="edit-broadcast-modal-description"
      >
        <Box
          sx={{
            outline: 'none',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '30%',
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" id="edit-broadcast-modal">
            Edit Broadcast Title
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="broadcast-name"
              label="Broadcast Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newBroadcastName}
              onChange={(e) => setNewBroadcastName(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleEditBroadcast}
                color="primary"
                variant="contained"
                sx={{ mr: 1 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleCloseEditDialog} color="error" variant="contained">
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatListing;
