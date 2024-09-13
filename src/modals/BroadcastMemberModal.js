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
  Button,
  Stack,
  TableHead,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  Toolbar,
  Grid,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch } from '@tabler/icons';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { selectBroadcast, setBroadcastList } from 'src/store/apps/chat/ChatSlice';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
  { id: 'tag', numeric: false, disablePadding: false, label: 'Tag' },
];

const EnhancedTableHead = (props) => {
  const {
    order,
    orderBy,
    onRequestSort,

    onSelectAllClick,

    selected,
    broadcastContacts,
  } = props;
  // const isAllSelected = rowCount === numSelected && selected.length === rowCount;
  // const isSomeSelected = numSelected > 0 && numSelected < rowCount;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  // console.log('rowCount:', rowCount);
  // console.log('numSelected:', numSelected);
  // console.log('Selected IDs:', selected);
  // console.log(rowCount > 0 && numSelected === rowCount, '---------');

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < broadcastContacts.length} // Partially selected
            checked={broadcastContacts.length > 0 && selected.length === broadcastContacts.length} // All selected
            onChange={onSelectAllClick}
            color="primary"
            inputProps={{
              'aria-label': 'select all',
            }}
            // indeterminate={isSomeSelected}
            // checked={isAllSelected}
            // onChange={onSelectAllClick}
            // color="primary"
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 600, fontSize: 14, padding: '12px 5px' }}
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
  onUpdateMembers,
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [broadcastContacts, setBroadcastContacts] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  //console.log('....', memberIds);
  //const { toggleOnOff } = useContext(EventContext);
  // const [numSelected, setNumSelected] = useState(0);
  const [filterCriteria, setFilterCriteria] = useState({
    column: '',
    operator: 'contains',
    value: '',
  });
  const dispatch = useDispatch();

  const getApiData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`update_broadcast_members/${activeBroadcastId}`);
      if (res.status === 200) {
        setBroadcastContacts(res.data.data.all_contacts);
        setAllContacts(res.data.data.all_contacts);
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

  useEffect(() => {
    // Update selected state based on memberIds
    setSelected(
      broadcastContacts.filter((contact) => contact.is_member).map((contact) => contact.id),
    );
  }, [broadcastContacts]);

  useEffect(() => {
    // Update memberIds based on selected
    setMemberIds(selected);
  }, [selected]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  // const handleCloseFilterDialog = () => {
  //   setFilterCriteria({
  //     column: '',
  //     operator: 'contains',
  //     value: '',
  //   });
  //   setBroadcastContacts(allContacts);
  //   setOpenFilterDialog(false);
  //   setSearch('');
  // };
  const handleClearFilter = () => {
    setFilterCriteria({
      column: '',
      operator: 'contains',
      value: '',
    });
    setBroadcastContacts(allContacts);
    setSearch('');
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    const { column, value } = filterCriteria;

    if (!column || !value) {
      console.error('Column or value is not defined:', column, value);
      return;
    }

    const filteredRows = broadcastContacts.filter((row) => {
      if (row[column] && typeof row[column] === 'string') {
        return row[column].toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });

    setBroadcastContacts(filteredRows);
    setOpenFilterDialog(false);
  };

  const handleClick = (event, id) => {
    event.stopPropagation(); // Prevent row click from firing
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id); // Add new ID if not selected
    } else {
      newSelected = newSelected.filter((selectedId) => selectedId !== id); // Remove if already selected
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = broadcastContacts.map((n) => n.id); // Select all IDs
      setSelected(newSelected);
    } else {
      setSelected([]); // Clear selection if unchecked
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleSelectedMemberStateUpdate = (id) => {
  //   // Toggle selection
  //   if (selected.includes(id)) {
  //     setSelected(selected.filter((item) => item !== id));
  //   } else {
  //     setSelected([...selected, id]);
  //   }
  // };

  // const updateBroadcastMembers = async () => {
  //   try {
  //     const res = await apiClient.patch(`/api/broadcasts/${activeBroadcastId}/`, {
  //       contacts: memberIds,
  //     });

  //     if (res.status === 200) {
  //       toast.success('Broadcast members updated successfully!');

  //       //dispatch(updateBroadcastMembers(res.data.data.contacts));
  //       handleClose();
  //       getBroadcastList();
  //       onUpdateMembers(res.data.data.contacts);
  //       dispatch(
  //         selectBroadcast({
  //           contacts: activeBroadcast.contacts.filter((data) => data.id !== memberIds),
  //           ...activeBroadcast,
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //     toast.error(error?.response?.data?.message ?? 'There was an error!');
  //   }
  // };
  const updateBroadcastMembers = async (event) => {
    event.preventDefault();
    setButtonLoading(true);
    try {
      const res = await apiClient.patch(`/api/broadcasts/${activeBroadcastId}/`, {
        contacts: memberIds,
      });

      if (res.status === 200) {
        toast.success('Broadcast members updated successfully!');

        dispatch(setBroadcastList(res.data.data.contacts));
        handleClose();
        getBroadcastList();
        onUpdateMembers(res.data.data.contacts);
        dispatch(
          selectBroadcast({
            contacts: res.data.data.contacts,
            ...activeBroadcast,
          }),
        );
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message ?? 'There was an error!');
    } finally {
      setButtonLoading(false);
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
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <form onSubmit={updateBroadcastMembers}>
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
                <Toolbar
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0px !important',
                  }}
                >
                  <Box sx={{ flex: '1 1 100%' }} border={0}>
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch size="1.1rem" />
                          </InputAdornment>
                        ),
                        sx: { background: 'white', borderRadius: 5 },
                      }}
                      placeholder="Search..."
                      size="small"
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <IconButton onClick={handleOpenFilterDialog} sx={{ color: '#1A4D2E' }}>
                      <FilterAltIcon size="1.1rem" />
                    </IconButton>
                  </Box>
                  <Stack
                    direction={'row'}
                    justifyContent={'end'}
                    gap={2}
                    style={{ paddingBlock: '1rem' }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={updateBroadcastMembers}
                      disabled={buttonLoading}
                      startIcon={
                        buttonLoading ? <CircularProgress size={20} color="inherit" /> : null
                      }
                    >
                      {buttonLoading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button color="error" variant="contained" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Stack>
                </Toolbar>
                <Paper
                  sx={{
                    width: '100%',
                    mb: 2,
                    border: '1px solid #E7EAF0',
                    mt: 2,
                    boxShadow: 'none',
                  }}
                >
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={paginatedContacts.length}
                        broadcastContacts={broadcastContacts}
                        selected={selected}
                      />
                      <TableBody>
                        {paginatedContacts.map((row, idx) => {
                          const isItemSelected = selected.indexOf(row.id) !== -1;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              onClick={(event) => handleClick(event, row.id)}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  // checked={isItemSelected}
                                  checked={selected.indexOf(row.id) !== -1}
                                  onChange={(event) => handleClick(event, row.id)}
                                  inputProps={{
                                    'aria-labelledby': `enhanced-table-checkbox-${row.id}`,
                                  }}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell sx={{ padding: '0px', minWidth: '120px' }}>
                                <Typography
                                  fontWeight="400 !important"
                                  variant="h6"
                                  fontSize="14px !important"
                                  padding="13px 4px !important"
                                >
                                  {row.name}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ padding: '0px' }}>
                                <Typography
                                  fontWeight="400 !important"
                                  variant="h6"
                                  fontSize="14px !important"
                                  padding="13px 4px !important"
                                >
                                  {row.full_mobile}
                                </Typography>
                              </TableCell>
                              <TableCell align="left" sx={{ padding: '0px' }}>
                                <Typography
                                  fontWeight="400 !important"
                                  variant="h6"
                                  fontSize="14px !important"
                                  padding="13px 4px !important"
                                >
                                  {row.city ? row.city : '-'}
                                </Typography>
                              </TableCell>
                              <TableCell align="left" sx={{ padding: '0px' }}>
                                <Typography
                                  fontWeight="400 !important"
                                  variant="h6"
                                  fontSize="14px !important"
                                  padding="13px 4px !important"
                                >
                                  {row.tag ? row.tag : '-'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={sortedContacts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Paper>
              </>
            )}
          </Box>
        </form>
      </Dialog>
      <Dialog
        open={openFilterDialog}
        onClose={handleCloseFilterDialog}
        sx={{ height: '70%' }}
        fullWidth
        maxWidth="sm"
      >
        <Paper sx={{ padding: '25px' }}>
          <DialogTitle sx={{ padding: 1 }}>Filter Contacts</DialogTitle>
          <DialogContent sx={{ padding: '17px 16px' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={6}
                sx={{ paddingTop: '25px !important', paddingLeft: '0px !important' }}
              >
                <Select
                  value={filterCriteria.column}
                  onChange={handleFilterChange}
                  fullWidth
                  name="column"
                  variant="outlined"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Column
                  </MenuItem>
                  {headCells.map((headCell) => (
                    <MenuItem key={headCell.id} value={headCell.id}>
                      {headCell.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} sx={{ paddingTop: '25px !important' }}>
                <TextField
                  fullWidth
                  label="Value"
                  variant="outlined"
                  name="value"
                  value={filterCriteria.value}
                  onChange={handleFilterChange}
                  sx={{ width: '265px' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', padding: '0px' }}>
            <Button
              variant="contained"
              onClick={handleClearFilter}
              sx={{
                backgroundColor: '#b4b4b4',
                '&:hover': {
                  backgroundColor: `#b4b4b4`,
                },
              }}
            >
              Clear Filter
            </Button>
            <Button
              onClick={applyFilter}
              variant="contained"
              color="primary"
              sx={{ marginLeft: '17rem !important' }}
            >
              Apply
            </Button>
            <Button onClick={handleCloseFilterDialog} variant="contained" color="error">
              Cancel
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default BroadcastMemberModal;
