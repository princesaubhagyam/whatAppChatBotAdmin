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
  // Toolbar,
  IconButton,
  Tooltip,
  Typography,
  // Avatar,
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
import { useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  IconSearch,
  //  IconFilter, IconTrash,
  IconFileImport,
  IconPlus,
} from '@tabler/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import apiClient from 'src/api/axiosClient';
import ImportContactModal from '../../modals/ImportContactModal';
import AddContactModal from '../../modals/AddContactModal';
import EditContactModal from '../../modals/EditContactModel';
import DeleteDialog from 'src/modals/DeleteDialog';
import { FirstLetterCapitalOfString } from 'src/utils/FirstLetterCapitalOfString';
import Nodatainsearch from 'src/components/noData/Nodatainsearch';

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
    handleEdit,
    setOpenDeleteDialog,
  } = props;
  const handleOpenAddContactModal = () => {
    setOpenAddContactModal(true);
  };
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  return (
    <>
      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          marginBottom: '15px',
        }}
      >
        {numSelected > 0 ? (
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              backgroundColor: '#00720b21',
            }}
          >
            <Typography variant="h5" marginLeft={'10px'}>
              {numSelected} selected
            </Typography>
            <Box>
              {numSelected === 1 ? (
                <Tooltip title="Edit">
                  <IconButton sx={{ color: '#1A4D2E' }} onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title="Delete">
                <IconButton sx={{ color: '#1A4D2E' }} onClick={handleOpenDeleteDialog}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        ) : (
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
              <Stack
                sx={{
                  flexDirection: { xs: 'row', sm: 'row' },
                  gap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: { xs: '3px', sm: '3px', lg: '0px' },
                }}
              >
                <Tooltip title="Filter">
                  <IconButton onClick={handleOpenFilterDialog} sx={{ color: '#1A4D2E' }}>
                    <FilterAltIcon size="1.1rem" />
                  </IconButton>
                </Tooltip>
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
  numSelected: PropTypes.arrayOf(PropTypes.number).isRequired,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onOpenImportModal: PropTypes.func.isRequired,
  handleOpenFilterDialog: PropTypes.func.isRequired,
};

const CustomersTableList = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPages] = useState(0);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [search, setSearch] = useState('');
  const [openImportModal, setOpenImportModal] = useState(false);
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({
    city: '',
    contact: ' ',
    name: '',
    tag: '',
    cc: '',
  });
  const [allDataForEdit, setAllDataForEdit] = useState([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    column: '',
    operator: 'contains',
    value: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    getApiData();
  }, [page, rowsPerPage]);

  const getApiData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/api/contacts/?page=${page + 1}&rows_per_page=${rowsPerPage}`,
      );
      const allData = response?.data?.data?.results;

      setTotalCount(response?.data?.data?.count);
      setTotalPages(response?.data?.data?.total_pages);
      setRows(allData);
      setAllRows(allData);
      setAllDataForEdit(allData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      setLoading(false);
    }
  };

  function handleEdit() {
    allDataForEdit &&
      allDataForEdit.length > 0 &&
      allDataForEdit.find(function (item) {
        if (item.id === selected[0]) {
          setEditData({
            city: item.city,
            contact: item.contact,
            name: item.name,
            tag: item.tag,
            cc: `+${item.cc}`,
          });
        }
        return;
      });
    setEdit(true);
  }

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);

    // Reset to the first page whenever a new search is performed
    setPage(0);

    if (searchValue === '') {
      // If search input is cleared, fetch data for the initial page without any filters
      getApiData();
    } else {
      try {
        //setLoading(true);
        const response = await apiClient.get(
          `/api/contacts/?name=${searchValue}&page=${page + 1}&rows_per_page=${rowsPerPage}`,
        );
        const filteredRows = response?.data?.data?.results;

        setRows(filteredRows);
        setTotalCount(response?.data?.data?.count);
        setTotalPages(response?.data?.data?.total_pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setLoading(false);
      }
    }
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClearFilter = async () => {
    setFilterCriteria({
      column: '',
      operator: 'contains',
      value: '',
    });

    setSearch('');

    setPage(0);

    try {
      //setLoading(true);
      const response = await apiClient.get(`/api/contacts/?page=1&rows_per_page=${rowsPerPage}`);
      const allData = response?.data?.data?.results;

      setRows(allData);
      setAllRows(allData);
      setTotalCount(response?.data?.data?.count);
      setTotalPages(response?.data?.data?.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      //setLoading(false);
    }
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = async (keys, values) => {
    // Reset to the first page whenever a new search is performed
    setPage(0);
    try {
      //setLoading(true);
      const response = await apiClient.get(
        `/api/contacts/?page=${page + 1}&rows_per_page=${rowsPerPage}&${keys}=${values}`,
      );
      const filteredRows = response?.data?.data?.results;

      setRows(filteredRows);
      setTotalCount(response?.data?.data?.count);
      setTotalPages(response?.data?.data?.total_pages);
      setOpenFilterDialog(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      setLoading(false);
    }
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
    setSelected([]);
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

  const handleConfirmDelete = async () => {
    setButtonLoading(true);
    try {
      await apiClient.delete(`api/contacts/bulk_delete/`, {
        data: { ids: selected },
      });
      toast.success('Contacts deleted successfully');

      setRows((prevRows) => prevRows.filter((row) => !selected.includes(row.id)));
      setAllRows((prevRows) => prevRows.filter((row) => !selected.includes(row.id)));
      getApiData();
      setSelected([]);
    } catch (error) {
      console.error('Failed to delete contacts:', error);
      toast.error('Failed to delete contacts');
    } finally {
      handleCloseDeleteDialog();
      setButtonLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Spinner />
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
            isItemSelected={selected}
            //handleDelete={handleDelete}
            setOpenDeleteDialog={setOpenDeleteDialog}
            handleEdit={handleEdit}
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
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Nodatainsearch />
                      </TableCell>
                    </TableRow>
                  ) : (
                    stableSort(rows, getComparator(order, orderBy))
                      //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
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
                                {FirstLetterCapitalOfString(row.name)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: '0px', minWidth: '150px' }}>
                              <Typography
                                fontWeight="400"
                                variant="h6"
                                fontSize={14}
                                padding="13px 4px"
                              >
                                {row.full_mobile}
                              </Typography>{' '}
                            </TableCell>
                            <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                              <Typography
                                fontWeight="400"
                                variant="h6"
                                fontSize={14}
                                padding="13px 4px"
                              >
                                {row.city ? FirstLetterCapitalOfString(row.city) : '-'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                              <Typography
                                fontWeight="400"
                                variant="h6"
                                fontSize={14}
                                padding="13px 4px"
                              >
                                {row.tag ? FirstLetterCapitalOfString(row.tag) : '-'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={totalCount}
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
                      value={filterCriteria?.column}
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
                      value={filterCriteria?.value}
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
                  onClick={() => handleApplyFilter(filterCriteria?.column, filterCriteria?.value)}
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
          <DeleteDialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleConfirmDelete}
            buttonLoading={buttonLoading}
          />

          <AddContactModal
            open={openAddContactModal}
            handleClose={() => setOpenAddContactModal(false)}
            onAddContact={handleAddContact}
          />
          <EditContactModal
            open={edit}
            selected={selected}
            setEdit={setEdit}
            editData={editData}
            setEditData={setEditData}
            getApiData={getApiData}
            setSelected={setSelected}
          />
        </>
      )}
    </Box>
  );
};

export default CustomersTableList;
