import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch, IconTrash } from '@tabler/icons';
import { useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const headCells = [
  {
    id: 'icon',
    numeric: false,
    disablePadding: false,
    label: '',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Broadcast Title',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At',
  },
  {
    id: 'member',
    numeric: false,
    disablePadding: false,
    label: 'Members',
  },
];

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
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'icon' ? (
              <BarChartIcon />
            ) : (
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
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, handleSearch, search } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} Selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', justifyContent: 'flex-end', textAlign: 'right', mr: 1 }}>
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
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};


const BroadcastTableList = ({ broadcasts }) => {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (id) => {
    navigate(`/broadcast/${id}`);
  };

  const filteredRows = broadcasts.filter((broadcast) =>
    broadcast.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <EnhancedTableToolbar
        numSelected={selected.length}
        search={search}
        handleSearch={(event) => handleSearch(event)}
      />
      <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover onClick={() => handleRowClick(row.id)} style={{ cursor: 'pointer' }}>
                  <TableCell>
                    <BarChartIcon />
                  </TableCell>
                  <TableCell>
                    <Typography>{row.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>BROADCAST</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{new Date(row.updated_at).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.members}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

BroadcastTableList.propTypes = {
  broadcasts: PropTypes.array.isRequired,
};

export default BroadcastTableList;

