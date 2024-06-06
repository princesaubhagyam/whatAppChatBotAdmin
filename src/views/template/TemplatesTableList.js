import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
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
  FormControlLabel,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardMedia,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import {
  IconDotsVertical,
  IconEye,
  IconFilter,
  IconMessage2Share,
  IconSearch,
  IconTrash,
} from '@tabler/icons';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import axiosClientBm from 'src/api/axiosClientBm';

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
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Template name',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },

  {
    id: 'language',
    numeric: false,
    disablePadding: false,
    label: 'Language',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'view',
    numeric: false,
    disablePadding: false,
    label: 'View',
  },
  // {
  //   id: 'edit',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Edit',
  // },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
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
        <Box sx={{ flex: '1 1 100%' }}>
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
        // <Tooltip title="Filter list">
        //   <IconButton>
        //     <IconFilter size="1.2rem" icon="filter" />
        //   </IconButton>
        // </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const TemplatesTableList = () => {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState([]);

  const handleClickOpen = (row, index) => {
    setOpen(true);
    setView(row.components);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
    try {
      const response = await axiosClientBm.get('/message_templates');
      setRows(response.data.data);
      return;
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleSearch = (event) => {
    const filteredRows = rows?.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value);
    });
    setSearch(event.target.value);
    setRows(filteredRows);
    if (!event.target.value) {
      getApiData();
    }
  };

  // This is for the sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // This is for the single row sleect
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
    getApiData();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box>
      <Box>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          handleSearch={(event) => handleSearch(event)}
        />
        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
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
                    // const isItemSelected = isSelected(row.id);
                    // const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.id)}
                        // role="checkbox"
                        // aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        // selected={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputprops={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell> */}
                        <TableCell>
                          <Typography fontWeight="500" variant="h6" fontSize={14}>
                            {row.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight="500" variant="h6" fontSize={14}>
                            {row.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="500" variant="h6" fontSize={14}>
                            {row.language}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="500" variant="h6" fontSize={14}>
                            <Chip
                              sx={{
                                bgcolor: (theme) =>
                                  row.status === 'PENDING'
                                    ? theme.palette.info.main
                                    : theme.palette.primary.light,
                                color: (theme) => theme.palette.primary.main,
                                borderRadius: '6px',
                                // width: 80,
                              }}
                              size="small"
                              label={row.status}
                            />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleClickOpen(row, index)}>
                              <IconEye />
                            </IconButton>
                          </Tooltip>
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
        {/* <Box ml={2}>
          <FormControlLabel
            control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box> */}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Your template'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {view.map((component) => {
              switch (component.type) {
                case 'HEADER':
                  return (
                    <CardMedia
                      sx={{ height: 240 }}
                      image={component.example?.header_handle[0]}
                      title={component.type}
                    />
                  );
                case 'BODY':
                  return (
                    <Typography key={component.type} variant="body1">
                      {component.text.split('\n').map(function (item, idx) {
                        return (
                          <span key={idx}>
                            {item}
                            <br />
                          </span>
                        );
                      })}
                    </Typography>
                  );
                case 'FOOTER':
                  return (
                    <Typography key={component.type} variant="caption">
                      {component.text}
                    </Typography>
                  );
                case 'BUTTONS':
                  return (
                    <Button key={component.type} variant="outline" href={component.buttons[0].url}>
                      <IconMessage2Share />
                      {component?.buttons[0].text}
                    </Button>
                  );
                default:
                  return null;
              }
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button color="error" onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatesTableList;
