import React, { useState, useEffect } from 'react';
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
  TableHead,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  Toolbar,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch } from '@tabler/icons';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { selectBroadcast, setBroadcastList } from 'src/store/apps/chat/ChatSlice';

export const getBroadcastsData = async () => {
  try {
    const response = await apiClient.get('/api/broadcasts/');
    return response.data.data.results;
  } catch (error) {
    toast.error('Error fetching data from API:', error);
  }
};
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'contact', numeric: false, disablePadding: false, label: 'Contact' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const BroadcastMemberModal = ({
  open,
  handleClose,
  activeBroadcastId,
  activeBroadcast,
  getBroadcastList = () => {},
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [broadcastContacts, setBroadcastContacts] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const dispatch = useDispatch();

  const getApiData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`update_broadcast_members/${activeBroadcastId}`);
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

  useEffect(() => {
    if (open === true) {
      getApiData();
    }
  }, [open]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        handleClose();
        getBroadcastList();
        console.log('activeBroadcast', activeBroadcast);
        dispatch(selectBroadcast(activeBroadcast));
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message ?? 'There was an error!');
    }
  };

  const filteredContacts = broadcastContacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedContacts = stableSort(filteredContacts, getComparator(order, orderBy));

  const paginatedContacts = sortedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '100%',
          margin: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Update Broadcast Members
        </Typography>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Toolbar>
              <TextField
                variant="outlined"
                placeholder="Search by name"
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </Toolbar>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {paginatedContacts.map((row, idx) => {
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedContacts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
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
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default BroadcastMemberModal;
