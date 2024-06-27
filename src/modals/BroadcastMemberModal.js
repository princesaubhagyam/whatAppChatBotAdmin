import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TableFooter,
  Button,
  Stack,
} from '@mui/material';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import toast from 'react-hot-toast';
import { getBroadcastsData } from 'src/views/apps/chat/Chat';
import { useDispatch } from 'react-redux';
import { setBroadcastList } from 'src/store/apps/chat/ChatSlice';

const BroadcastMemberModal = ({ open, handleClose, activeBroadcastId }) => {
  const [scroll, setScroll] = React.useState('paper');
  const [loading, setLoading] = React.useState(true);
  const [broadcastContacts, setBroadcastContacts] = React.useState([]);
  const [memberIds, setMemberIds] = React.useState([]);
  const dispatch = useDispatch();

  const getApiData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/update_broadcast_members/${activeBroadcastId}`);
      if (res.status === 200) {
        setBroadcastContacts(res.data.data.all_contacts);
        setMemberIds(
          res.data.data.all_contacts
            .filter((contact) => contact.is_member)
            .map((contact) => contact.id),
        );
      }
    } catch (err) {
      toast.error(
        err.response.data.message ?? 'There was an error fetching the broadcast members!',
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open === true) {
      getApiData();
    }
  }, [open]);

  const handleSelectedMemberStateUpdate = (memberId) => {
    const tmpMembers = [...memberIds];
    const idx = tmpMembers.indexOf(memberId);
    if (idx === -1) {
      tmpMembers.push(memberId);
    } else {
      tmpMembers.splice(idx, 1);
    }
    setMemberIds(tmpMembers);
  };

  const updateBroadcastMembers = async () => {
    try {
      const res = await apiClient.patch(`/api/broadcasts/${activeBroadcastId}/`, {
        contacts: memberIds,
      });
      if (res.status === 200) {
        toast.success('Broadcast members updated successfully!');
        const broadcastsRes = await getBroadcastsData();
        dispatch(setBroadcastList(broadcastsRes));
        handleClose();
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message ?? 'There was an error!');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition
      scroll={scroll}
      fullWidth
      maxWidth="lg"
    >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '100%',
          margin: 'auto',
          //mt: 10,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Update broadcast members
        </Typography>
        {loading ? (
          <Spinner />
        ) : (
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                <TableBody>
                  {broadcastContacts?.map((row, idx) => {
                    const labelId = `enhanced-table-checkbox-${idx}`;
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={memberIds.includes(row.id)}
                            onChange={() => handleSelectedMemberStateUpdate(row.id)}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="400" fontSize={12} padding="13px 4px">
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            fontWeight="400"
                            variant="h6"
                            fontSize={14}
                            padding="13px 4px"
                          >
                            {row.contact}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            fontWeight="400"
                            variant="h6"
                            fontSize={14}
                            padding="13px 4px"
                          >
                            {row.city}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              direction={'row'}
              justifyContent={'end'}
              gap={2}
              style={{ paddingBlock: '1rem', paddingInline: '2rem' }}
            >
              <Button variant="contained" color="primary" onClick={updateBroadcastMembers}>
                Update
              </Button>
              <Button color="error" variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
    </Dialog>
  );
};

export default BroadcastMemberModal;
