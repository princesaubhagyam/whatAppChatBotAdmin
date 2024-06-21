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
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import { IconSearch, IconFilter, IconTrash, IconFileImport, IconPlus } from '@tabler/icons';
import apiClient from 'src/api/axiosClient';
import ImportContactModal from '../../modals/ImportContactModal';
import AddContactModal from '../../modals/AddContactModal';
import createAxiosInstanceWithToken from 'src/api/axiosClient'; 

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
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created at' },
  { id: 'updated_at', numeric: false, disablePadding: false, label: 'Updated at' },
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
            style={{ fontWeight: 500, fontSize: 16, padding: '13px 16px' }}
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
  const { numSelected, handleSearch, search, onOpenImportModal, setOpenAddContactModal } = props;
  const handleOpenAddContactModal = () => {
    setOpenAddContactModal(true);
  };
  return (
    <>
      {/* <Grid container spacing={2} alignItems="center" sx={{ mx: 2, mt: 1, mb: 2 }} pl={0}>
        <Grid paddingLeft={0}> */}
      {/* <Button
            style={{
              backgroundColor: '#1A4D2E',
              color: 'white',
              width: '8rem',
              paddingLeft: '0px',
              paddingRight: '0px',
            }}
            onClick={handleOpenAddContactModal}
          >
            <IconPlus size={16} style={{marginRight: '2px'}}/>
            Add Contact
          </Button> */}
      {/* <Box sx={{ flex: '1 1 100%' }} border={0}>
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
        </Grid>
        <Grid item ml={'40.5rem'}>
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
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid> */}
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px'}}>
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
        <Stack sx={{flexDirection: 'row',gap: 2}}>
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
      </Stack>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onOpenImportModal: PropTypes.func.isRequired,
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
  useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
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
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredRows = allRows.filter((row) => row.name.toLowerCase().includes(searchValue));
    setSearch(event.target.value);
    setRows(filteredRows);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <Box sx={{ width: '100%' }}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        handleSearch={handleSearch}
        search={search}
        onOpenImportModal={() => setOpenImportModal(true)}
        setOpenAddContactModal={setOpenAddContactModal}
      />
      <Paper sx={{ width: '100%', mb: 2 }}>
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
                      <TableCell>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {row.contact}
                        </Typography>{' '}
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {row.city}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {row.tag}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {formatDate(createdAtDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {formatDate(updatedAtDate)}
                        </Typography>
                      </TableCell>
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
      <ImportContactModal open={openImportModal} handleClose={() => setOpenImportModal(false)} />
      <AddContactModal
        open={openAddContactModal}
        handleClose={() => setOpenAddContactModal(false)}
      />
    </Box>
  );
};

export default CustomersTableList;
