import React, { useState } from 'react';
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
import { IconPlus, IconDotsVertical } from '@tabler/icons';
import BroadcastMemberModal from 'src/components/BroadcastMemberModal';
import CustomersTableList from 'src/views/customers/CustomersTableList';

const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  const initials = words.map((word) => word[0]).join('');
  return initials.toUpperCase();
};

const ChatListingMember = () => {
  const dispatch = useDispatch();
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <Button onClick={() => setIsModalOpen(true)}>
                <IconPlus size={'20'} />
              </Button>
              <IconDotsVertical size={'16'} />
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
                          variant="dot"
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
      <BroadcastMemberModal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <Typography variant="h6" component="h2" mb={2}>
          Add Contacts
        </Typography>
        <CustomersTableList hideToolbar={true} />
      </BroadcastMemberModal>
    </>
  );
};

export default ChatListingMember;
