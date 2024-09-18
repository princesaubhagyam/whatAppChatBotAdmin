import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { format } from 'date-fns';

import apiClient from 'src/api/axiosClient'; // Ensure this path is correct
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import Nodatainsearch from 'src/components/noData/Nodatainsearch'; // Ensure this path is correct
import Spinner from './spinner/Spinner';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Payment History' }];

const headCells = [
  { id: 'amount_received', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'currency', numeric: false, disablePadding: false, label: 'Currency' },
  //   { id: 'customer', numeric: false, disablePadding: false, label: 'Customer' },
  { id: 'payment_method', numeric: false, disablePadding: false, label: 'Payment Method' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'created', numeric: false, disablePadding: false, label: 'Created At' },
];

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

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 500, fontSize: 16, padding: '12px 14px' }}
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

const PaymentHistory = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created');
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getApiData();
  }, [page, rowsPerPage]);

  const getApiData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/transactions/?page=${page + 1}&rows_per_page=${rowsPerPage}`,
      );
      const { count, results } = response.data.data;

      setRows(results);
      setTotalCount(count);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);

    if (searchValue === '') {
      getApiData();
    } else {
      try {
        const response = await apiClient.get(
          `/transactions/?search=${searchValue}&page=${page + 1}&rows_per_page=${rowsPerPage}`,
        );
        const { count, results } = response.data.data;

        setRows(results);
        setTotalCount(count);
      } catch (error) {
        console.error('Error searching data from API:', error);
      }
    }
  };

  return (
    <PageContainer title="Payment History" description="This is the Payment History page">
      <Breadcrumb title="Payments" items={BCrumb} />
      <Box sx={{ width: '100%' }}>
        {/* <Stack direction="row" justifyContent="space-between" mb={2}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Stack> */}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="top">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        textAlign="start"
                      >
                        <Spinner />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      <Nodatainsearch />
                    </TableCell>
                  </TableRow>
                ) : (
                  stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 14px">
                          {row.amount_received}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 14px">
                          {row.currency}
                        </Typography>
                      </TableCell>
                      {/* <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 4px">
                          {row.customer}
                        </Typography>
                      </TableCell> */}
                      <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 14px">
                          {row.payment_method_types[0]}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 14px">
                          {/* {row.status} */}
                          <Chip
                            sx={{
                              bgcolor: (theme) =>
                                row.status === 'Succeeded'
                                  ? theme.palette.primary.light
                                  : row.status === 'REJECTED'
                                  ? theme.palette.error.light
                                  : theme.palette.warning.light,
                              color: (theme) =>
                                row.status === 'Succeeded'
                                  ? theme.palette.primary.main
                                  : row.status === 'REJECTED'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                              borderRadius: '6px',
                              // width: 80,
                            }}
                            size="small"
                            label={row.status.toUpperCase()}
                          />
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: '0px', minWidth: '180px' }}>
                        <Typography fontWeight="400" variant="h6" fontSize={14} padding="13px 14px">
                          {/* {new Date(row.created).toLocaleString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })} */}
                          {/* {new Date(row.created).toLocaleString()} */}
                          {format(new Date(row.created), 'dd/MM/yyyy, hh:mm a')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default PaymentHistory;
