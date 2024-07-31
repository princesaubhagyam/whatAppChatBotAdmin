import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  TablePagination,
  Checkbox,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { IconSearch, IconFilter, IconTrash, IconFileImport, IconPlus } from '@tabler/icons';
import DeleteIcon from '@mui/icons-material/Delete';

import apiClient from 'src/api/axiosClient';
import ImportContactModal from '../../modals/ImportContactModal';
import AddContactModal from '../../modals/AddContactModal';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'contact', numeric: false, disablePadding: false, label: 'Contact' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  { id: 'tag', numeric: false, disablePadding: false, label: 'Tag' },
  // { id: 'created_at', numeric: false, disablePadding: false, label: 'Created at' },
  // { id: 'updated_at', numeric: false, disablePadding: false, label: 'Updated at' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 500, fontSize: 16, padding: '12px 5px' }}
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
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    handleSearch,
    search,
    onOpenImportModal,
    setOpenAddContactModal,
    showButtons,
    handleOpenFilterDialog,
  } = props;
  const handleOpenAddContactModal = () => {
    setOpenAddContactModal(true);
  };
  return (
    <>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
      {numSelected > 0 ? (
        
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', backgroundColor: '#00720b21' }}>
          <Typography variant='h5' marginLeft={'10px'}> {numSelected} selected </Typography>
          <Tooltip title="Delete">
            <IconButton sx={{ color: '#1A4D2E' }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        // When no items are selected
        <>
          <Stack>
            <Box sx={{ flex: '1 1 100%' }} border={0}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="1.1rem" />
                    </InputAdornment>
                  ),
                }}
                sx={{ background: 'white', borderRadius: 4 }}
                placeholder="Search..."
                size="small"
                onChange={handleSearch}
                value={search}
                fullWidth
              />
            </Box>
          </Stack>
          {showButtons && (
            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
              <IconButton onClick={handleOpenFilterDialog} sx={{ color: '#1A4D2E' }}>
                <FilterAltIcon size="1.1rem" />
              </IconButton>
              <Button
                style={{
                  backgroundColor: '#1A4D2E',
                  color: 'white',
                  width: '8rem',
                  paddingLeft: '0px',
                  paddingRight: '0px',
                }}
                onClick={handleOpenAddContactModal}
              >
                <IconPlus size={16} style={{ marginRight: '2px' }} />
                Add Contact
              </Button>
              <Button
                style={{
                  backgroundColor: '#1A4D2E',
                  color: 'white',
                  width: '9rem',
                  paddingLeft: '0px',
                  paddingRight: '0px',
                }}
                onClick={onOpenImportModal}
              >
                <IconFileImport size={16} style={{ marginRight: '2px' }} />
                Import Contact
              </Button>
            </Stack>
          )}
        </>
      )}
    </Stack>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onOpenImportModal: PropTypes.func.isRequired,
  handleOpenFilterDialog: PropTypes.func.isRequired,
};

const CustomersTableList = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState('');
  const [openImportModal, setOpenImportModal] = useState(false);
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    column: '',
    operator: 'contains',
    value: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
    setLoading(true);
    let allData = [];
    let pageNum = 1;
    let hasNextPage = true;
    while (hasNextPage) {
      try {
        const response = await apiClient.get(
          `/api/contacts/?page=${pageNum}&rows_per_page=${rowsPerPage}`,
        );
        allData = allData.concat(response.data.data.results || []);
        hasNextPage = response.data.next !== null;
        pageNum += 1;
      } catch (error) {
        console.error('Error fetching data from API:', error);
        hasNextPage = false;
      }
    }
    setAllRows(allData);
    setRows(allData);
    setLoading(false);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value === '') {
      setRows(allRows);
    } else {
      const filteredRows = allRows.filter((row) =>
        row.name.toLowerCase().includes(event.target.value.toLowerCase()),
      );
      // console.log('=====', filteredRows);
      setRows(filteredRows);
    }
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterCriteria({
      column: '',
      operator: 'contains',
      value: '',
    });
    setOpenFilterDialog(false);
    setRows(allRows);
    setSearch('');
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

    const filteredRows = allRows.filter((row) => {
      if (row[column] && typeof row[column] === 'string') {
        return row[column].toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });

    console.log('Filtered Rows:', filteredRows);

    setRows(filteredRows);
    setOpenFilterDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleAddContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
    getApiData();
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Spinner /> // Display spinner while loading is true
      ) : (
        <>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleSearch={handleSearch}
            search={search}
            onOpenImportModal={() => setOpenImportModal(true)}
            setOpenAddContactModal={setOpenAddContactModal}
            showButtons={true}
            handleOpenFilterDialog={handleOpenFilterDialog}
          />
          <Paper sx={{ width: '100%', mb: 2, mx: 'auto' }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const createdAtDate = new Date(row.created_at);
                      const updatedAtDate = new Date(row.updated_at);
                      const formatDate = (date) => {
                        return date.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        });
                      };
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {row.name}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: '0px', minWidth: '150px' }}>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {row.contact}
                            </Typography>{' '}
                          </TableCell>
                          <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {row.city ? row.city : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {row.tag ? row.tag : '-'}
                            </Typography>
                          </TableCell>
                          {/* <TableCell>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {formatDate(createdAtDate)}
                            </Typography>
                          </TableCell> */}
                          {/* <TableCell>
                            <Typography
                              fontWeight="400"
                              variant="h6"
                              fontSize={14}
                              padding="13px 4px"
                            >
                              {formatDate(updatedAtDate)}
                            </Typography>
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Dialog
            open={openFilterDialog}
            onClose={handleCloseFilterDialog}
            sx={{ height: '70%' }}
            fullWidth="lg"
          >
            <Paper sx={{ padding: '25px' }}>
              <DialogTitle sx={{ padding: 1 }}>Filter Contacts</DialogTitle>
              <DialogContent>
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
                  <Grid item xs={6} lg={6} sx={{ paddingTop: '25px !important' }}>
                    <TextField
                      fullWidth="lg"
                      label="Value"
                      variant="outlined"
                      name="value"
                      value={filterCriteria.value}
                      onChange={handleFilterChange}
                      style={{
                        width: '265px',
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ justifyContent: 'space-around', padding: '0px' }}>
                <Button
                  variant="contained"
                  onClick={handleCloseFilterDialog}
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
                  sx={{ marginLeft: '16rem !important' }}
                >
                  Apply
                </Button>
                <Button onClick={handleCloseFilterDialog} variant="contained" color="error">
                  Cancel
                </Button>
              </DialogActions>
            </Paper>
          </Dialog>
          <ImportContactModal
            open={openImportModal}
            handleClose={() => setOpenImportModal(false)}
            getApiData={getApiData}
          />

          <AddContactModal
            open={openAddContactModal}
            handleClose={() => setOpenAddContactModal(false)}
            onAddContact={handleAddContact}
          />
        </>
      )}
    </Box>
  );
};

export default CustomersTableList;
