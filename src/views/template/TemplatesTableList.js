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
import DeleteDialog from 'src/modals/DeleteDialog';
import { visuallyHidden } from '@mui/utils';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { useState } from 'react';
import {
  IconDotsVertical,
  IconEye,
  IconFilter,
  IconMessage2Share,
  IconSearch,
  IconTrash,
} from '@tabler/icons';

import createMetaAxiosClient from 'src/api/axiosClientMeta';
import { LoadingButton } from '@mui/lab';

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
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
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
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [currentId, setCurrentId] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickOpen = (row, index) => {
    console.log('Row clicked:', row);
    setOpen(true);
    //setView(row.components);
    setView(row.components || []);
    setDialogTitle(row.name);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
    try {
      const metaAxiosClient = createMetaAxiosClient();
      const response = await metaAxiosClient.get('/message_templates');
      setRows(response.data.data);
      return;
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  // const handleDelete = async (id, templateName) => {
  //   try {
  //     const metaAxiosClient = createMetaAxiosClient();
  //     await metaAxiosClient.delete(`/message_templates`, {
  //       params: {
  //         hsm_id: id,
  //         name: templateName,
  //       },
  //     });

  //     setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  //   } catch (error) {
  //     console.error('Error deleting template:', error);
  //   }
  // };

  // const handleDeleteClick = (id, templateName) => {
  //   setCurrentId(id);
  //   setCurrentName(templateName);
  //   setDeleteOpen(true);
  //   handleDeleteApi(id, templateName); // delete the row
  // };

  const handleDelete = (id, templateName) => {
    setCurrentId(id);
    setCurrentName(templateName);
    setConfirmDelete(true);
  };
  const handleConfirmDelete = async () => {
    setConfirmDelete(false);
    setLoading(true); 

    try {
      await handleDeleteApi(currentId, currentName);
    } finally {
      setLoading(false); 
    }
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  // Add this new function to handle the API call for deleting a template
  const handleDeleteApi = async (id, templateName) => {
    try {
      const metaAxiosClient = createMetaAxiosClient();
      await metaAxiosClient.delete(`/message_templates`, {
        params: {
          hsm_id: id,
          name: templateName,
        },
      });

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
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

  // const handleDeleteClick = (id, templateName) => {
  //   if (window.confirm(`Are you sure you want to delete the template: ${templateName}?`)) {
  //     handleDelete(id, templateName);
  //   }
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

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
                                  row.status === 'APPROVED'
                                    ? theme.palette.primary.light
                                    : row.status === 'REJECTED'
                                    ? theme.palette.error.light
                                    : theme.palette.warning.light,
                                color: (theme) =>
                                  row.status === 'APPROVED'
                                    ? theme.palette.primary.main
                                    : row.status === 'REJECTED'
                                    ? theme.palette.error.main
                                    : theme.palette.warning.main,
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
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(row.id, row.name)}
                          >
                            <DeleteOutline />
                          </IconButton>
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
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent sx={{ padding: '7px 8px' }}>
          <DialogContentText id="alert-dialog-description">
            <Box>
              <CardMedia
                component="div"
                image={img}
                sx={{
                  overflow: 'auto',
                  backgroundSize: 'cover',
                  boxShadow: '0px 1px 5px #00000025',
                  p: 2,
                  border: '1px solid lightgrey',
                  borderRadius: '8px',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#E9FEEE',
                    padding: 1,
                    boxShadow: '0px 1px 110px #00000025',
                    borderBottom: '1px solid #80808078',
                  }}
                >
                  {view.length > 0 &&
                    view.map((component) => {
                      console.log('component', component);
                      switch (component.type) {
                        case 'HEADER': {
                          const headerHandle = component.example?.header_handle?.[0];
                          const headerText = component.example?.header_text?.[0];
                          if (headerHandle) {
                            const isVideo = component.format === 'VIDEO';
                            return isVideo ? (
                              <CardMedia
                                key={component.type}
                                component="video"
                                image={headerHandle}
                                controls
                                title={component.type}
                                sx={{ height: 200 }}
                                autoPlay
                              />
                            ) : (
                              <CardMedia
                                key={component.type}
                                component="img"
                                image={headerHandle}
                                title={component.type}
                                sx={{ height: 200 }}
                              />
                            );
                          }

                          if (headerText) {
                            return (
                              <Typography key={'1'} variant="body1">
                                <span key={'1'}>
                                  {headerText}
                                  <br />
                                </span>
                              </Typography>
                            );
                          }

                          return null;
                        }

                        case 'BODY':
                          return (
                            <Typography key={component?.type} variant="body1">
                              {component?.text.split('\n').map((item, idx) => (
                                <span key={idx}>
                                  {item}
                                  <br />
                                </span>
                              ))}
                            </Typography>
                          );

                        case 'FOOTER':
                          return (
                            <Typography
                              key={component?.type}
                              variant="caption"
                              sx={{ fontStyle: 'bold', fontSize: '0.85rem', color: 'gray' }}
                            >
                              {component?.text}
                            </Typography>
                          );
                        default:
                          return null;
                      }
                    })}
                </Box>

                <Box
                  sx={{
                    backgroundColor: 'white',
                    width: '100%',
                    mt: '1px',
                    boxShadow: '0px 1px 5px #00000025',
                  }}
                >
                  {view.length > 0 &&
                    view.map((component) => {
                      if (component?.type === 'BUTTONS') {
                        return (
                          <Button
                            key={component?.type}
                            variant="outline"
                            href={component?.buttons[0].url}
                            sx={{
                              backgroundColor: 'transparent',
                              color: '#0093E1',
                              fontSize: '1rem',
                              fontWeight: '600',
                              width: '100%',
                              '&:hover': { backgroundColor: '#1a4d2e00', color: '#0093E1' },
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <IconMessage2Share />
                            {component?.buttons[0].icon}
                            {component?.buttons[0].text}
                          </Button>
                        );
                      }
                      return null;
                    })}
                </Box>
              </CardMedia>
            </Box>
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
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="confirm-delete-dialog"
        sx={{ top: '-200px' }}
      >
        <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the template?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            loadingPosition="start"
            loading={loading}
          >
            Delete
          </LoadingButton>
          <Button onClick={() => setConfirmDelete(false)} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatesTableList;
