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
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '../../custom-scroll/Scrollbar';
import { IconPlus, IconDotsVertical, IconEdit, IconFileImport } from '@tabler/icons';
import BroadcastMemberModal from 'src/modals/BroadcastMemberModal';
import ImportBroadcastMember from 'src/modals/ImportBroadcastMember';
import apiClient from 'src/api/axiosClient';
import EventContext from 'src/BroadcastContext';

const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  const initials = words.map((word) => word[0]).join('');
  return initials.toUpperCase();
};

const ChatListingMember = ({ getBroadcastList }) => {
  const dispatch = useDispatch();
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const { isOn } = useContext(EventContext);


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
  }, [activeBroadcast, isOn]);

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
                <b style={{ fontSize: '1rem' }}>Members in broadcast</b>
                <br />
                {activeBroadcast.members} members
              </Typography>
              {!isHistory && (
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
              )}

              {!isHistory && (
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
              )}
            </Stack>
          </Box>
          <List sx={{ px: 0 }}>
            <Scrollbar
              sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '550px' }}
            >
              {activeBroadcast && activeBroadcast.contacts ? (
                activeBroadcast.contacts.map((member) => (
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
                          //variant="dot"
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
                          >
                            {member.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="subtitle1" fontSize={13}>
                            +{member.contact}
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
        </div>
      )}
      <BroadcastMemberModal
        open={isMemberModalOpen}
        handleClose={() => setIsMemberModalOpen(false)}
        activeBroadcastId={activeBroadcast?.id}
        getBroadcastList={getBroadcastList}
        activeBroadcast={activeBroadcast}
      />
      <ImportBroadcastMember
        open={isImportModalOpen}
        handleClose={() => setIsImportModalOpen(false)}
        activeBroadcastId={activeBroadcast?.id}
      />
    </>
  );
};

export default ChatListingMember;
